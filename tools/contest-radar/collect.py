#!/usr/bin/env python3
"""Collect public competition notices and build the static contest-radar dataset."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Any

TOOL_DIR = Path(__file__).resolve().parent
ROOT = TOOL_DIR.parents[1]
OUTPUT = ROOT / "source" / "contest-radar" / "data.json"
WHITELIST_FILE = TOOL_DIR / "whitelist.json"
PROJECTS_FILE = TOOL_DIR / "projects.json"
USER_AGENT = "ContestRadar/1.0 (+https://fightergodnemo.github.io/contest-radar/)"
MAX_RESPONSE_BYTES = 3 * 1024 * 1024
DATE_TOKEN = r"(?:(?:20\d{2})\s*[年./-]\s*)?\d{1,2}\s*[月./-]\s*\d{1,2}\s*日?"
DATE_RE = re.compile(
    r"(?:(?P<year>20\d{2})\s*[年./-]\s*)?(?P<month>\d{1,2})\s*[月./-]\s*(?P<day>\d{1,2})\s*日?"
)

OFFICIAL_LINKS = {
    25: "https://www.ciscn.cn/",
    38: "https://www.isclab.org.cn/",
}

ALIASES = {
    1: ["互联网+", "中国国际大学生创新大赛"],
    4: ["蓝帽杯"],
    5: ["智警杯"],
    6: ["盘古石杯"],
    7: ["美亚杯"],
    13: ["码蹄杯"],
    14: ["上海市大学生网络安全大赛", "磐石行动"],
    22: ["中国大学生计算机设计大赛"],
    23: ["中国高校计算机大赛", "C4"],
    24: ["蓝桥杯"],
    25: ["全国大学生信息安全竞赛", "CISCN"],
    26: ["中国软件杯"],
    31: ["中国机器人及人工智能大赛"],
    38: ["信息安全与对抗技术竞赛", "ISCC"],
    52: ["上海市大学生计算机应用能力大赛"],
}

SEARCH_QUERIES = [
    ("国内赛事报名", "CTF 比赛 报名 OR 网络安全 大赛 报名"),
    ("电子取证赛事", "电子数据取证 大赛 报名 OR 电子取证 竞赛 通知"),
    ("作品赛通知", "信息安全 作品赛 报名 OR 计算机 作品赛 通知"),
    ("微信公众号公开索引", "site:mp.weixin.qq.com 大赛 报名 CTF OR 电子取证 OR 信息安全"),
]

TOPIC_PROJECTS = {
    "溯脉": ["日志", "攻击链", "电子取证", "数据取证", "恶意域名", "入侵检测"],
    "深鉴": ["深度伪造", "深伪", "数字人", "AIGC", "鉴伪"],
    "法底捞针": ["反诈", "诈骗", "公安", "警务"],
    "反诈青春盾": ["反诈", "诈骗", "小程序"],
    "低空智感": ["无人机", "低空", "目标识别"],
    "青山哨兵 EcoSentinel": ["遥感", "生态", "变化检测"],
    "VoxEMW": ["数字人", "语音", "多模态"],
    "AI 辅导员小严学长": ["智慧校园", "教育", "辅导员"],
    "琉璃帝国 RTS": ["游戏", "数字媒体"],
    "游戏融合工程": ["游戏", "数字媒体"],
}


def read_json(path: Path, default: Any) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def clean_text(value: Any, limit: int = 600) -> str:
    text = html.unescape(str(value or ""))
    text = re.sub(r"<script\b.*?</script>|<style\b.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:limit]


def normalise_lookup(value: str) -> str:
    return re.sub(r"[\s\-—_·•‘’“”\"'()（）\[\]【】:：/\\,.，。]", "", value).lower()


def classify(text: str) -> str:
    value = text.lower()
    if re.search(r"取证|forensic|盘古石|美亚杯|獬豸", value, re.I):
        return "电子取证"
    if re.search(r"作品|创新创业|科技应用创新|科技创新|创新设计|软件设计|计算机设计|应用能力|创客|挑战杯|互联网\+|数字媒体|创造杯|信息安全竞赛", value, re.I):
        return "作品赛"
    if re.search(r"ctf|夺旗|网络攻防|网络安全技能|蓝帽杯|信息安全与对抗|网络技术挑战", value, re.I):
        return "CTF / 网安"
    if re.search(r"人工智能|大数据|算法|机器人|数学建模|物联网|低空|无人机", value, re.I):
        return "AI / 大数据"
    if re.search(r"程序设计|acm|icpc|蓝桥杯|码蹄杯|华为ict|计算机系统能力", value, re.I):
        return "程序设计"
    return "综合竞赛"


def match_whitelist(text: str, whitelist: list[dict[str, Any]]) -> list[int]:
    lookup = normalise_lookup(text)
    matches = []
    for item in whitelist:
        names = [item["name"], *ALIASES.get(item["id"], [])]
        if any(len(normalise_lookup(name)) >= 4 and normalise_lookup(name) in lookup for name in names):
            matches.append(item["id"])
    return matches


def project_names_for(ids: list[int], text: str, projects: list[dict[str, Any]]) -> list[str]:
    names = []
    if ids:
        names.extend(p["name"] for p in projects if any(i in ids for i in p["competition_ids"]))
    lookup = text.lower()
    for project_name, keywords in TOPIC_PROJECTS.items():
        if any(keyword.lower() in lookup for keyword in keywords):
            names.append(project_name)
    return list(dict.fromkeys(names))[:4]


def score_event(whitelist_ids: list[int], projects: list[str], deadline: str | None, strong: bool = False) -> int:
    score = 30 + (25 if whitelist_ids else 0) + min(24, len(projects) * 8)
    score += 10 if deadline else 0
    score += 8 if strong else 0
    return min(score, 98)


def build_watchlist(whitelist: list[dict[str, Any]], projects: list[dict[str, Any]]) -> list[dict[str, Any]]:
    result = []
    for item in whitelist:
        matched = [p["name"] for p in projects if item["id"] in p["competition_ids"]]
        summary = (
            "可衔接项目：" + "、".join(matched[:3]) + "。须按当届赛题形成独立版本。"
            if matched else "已纳入长期监测，等待新一届官方通知与公开报名线索。"
        )
        result.append({
            "id": f"whitelist-{item['id']}",
            "title": item["name"],
            "category": classify(item["name"]),
            "url": OFFICIAL_LINKS.get(item["id"]),
            "source": "学校竞赛白名单",
            "whitelist": True,
            "whitelist_ids": [item["id"]],
            "school_status": item["school_status"],
            "department": item["department"],
            "status": "monitoring",
            "registration_deadline": None,
            "deadline_confidence": None,
            "event_start": None,
            "event_end": None,
            "published_at": None,
            "matched_projects": matched[:4],
            "match_score": min(96, 42 + len(matched) * 7 + (6 if item["school_status"] == "准备组织学生参赛" else 0)),
            "summary": summary,
            "analysis_mode": "profile",
        })
    return result


def http_get(url: str, timeout: int = 18) -> bytes:
    request = urllib.request.Request(url, headers={
        "User-Agent": USER_AGENT,
        "Accept": "application/rss+xml, application/atom+xml, application/json, text/xml, text/html;q=0.8, */*;q=0.5",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.6",
    })
    with urllib.request.urlopen(request, timeout=timeout) as response:
        data = response.read(MAX_RESPONSE_BYTES + 1)
        if len(data) > MAX_RESPONSE_BYTES:
            raise ValueError("response too large")
        return data


def iso_datetime(value: Any) -> str | None:
    if not value:
        return None
    text = str(value).strip()
    try:
        if re.match(r"^\d{4}-\d{2}-\d{2}T", text):
            dt = datetime.fromisoformat(text.replace("Z", "+00:00"))
        else:
            dt = parsedate_to_datetime(text)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
    except (TypeError, ValueError, OverflowError):
        return None


def date_from_match(match: re.Match[str], reference: datetime) -> tuple[str, bool] | None:
    try:
        year = int(match.group("year")) if match.group("year") else reference.year
        month = int(match.group("month"))
        day = int(match.group("day"))
        candidate = datetime(year, month, day, tzinfo=timezone.utc)
        if not match.group("year") and candidate < reference - timedelta(days=60):
            candidate = datetime(year + 1, month, day, tzinfo=timezone.utc)
        return candidate.strftime("%Y-%m-%d"), bool(match.group("year"))
    except ValueError:
        return None


def extract_registration_deadline(text: str, published_at: str | None = None) -> tuple[str | None, str | None]:
    reference = datetime.now(timezone.utc)
    if published_at:
        try:
            reference = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
        except ValueError:
            pass
    range_match = re.search(rf"报名.{{0,48}}?({DATE_TOKEN})\s*(?:至|到|—|–|-)\s*({DATE_TOKEN})", text, re.I)
    if range_match:
        match = DATE_RE.search(range_match.group(2))
        if match:
            parsed = date_from_match(match, reference)
            if parsed:
                return parsed[0], "high" if parsed[1] else "medium"
    for match in DATE_RE.finditer(text):
        context = text[max(0, match.start() - 40):min(len(text), match.end() + 40)]
        if not re.search(r"报名.{0,24}(截止|截至|结束)|截止|截至|register(?:ed|ation)?\s+by|registration\s+deadline", context, re.I):
            continue
        parsed = date_from_match(match, reference)
        if parsed:
            return parsed[0], "high" if parsed[1] else "medium"
    return None, None


def canonical_url(url: str) -> str:
    try:
        parsed = urllib.parse.urlsplit(url)
        if parsed.scheme not in {"http", "https"}:
            return ""
        query = urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)
        query = [(k, v) for k, v in query if not k.lower().startswith("utm_") and k.lower() not in {"from", "spm"}]
        return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc.lower(), parsed.path, urllib.parse.urlencode(query), ""))
    except ValueError:
        return ""


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1].lower()


def parse_feed(data: bytes) -> list[dict[str, str]]:
    root = ET.fromstring(data)
    items = []
    for node in root.iter():
        if local_name(node.tag) not in {"item", "entry"}:
            continue
        fields: dict[str, str] = {}
        for child in list(node):
            key = local_name(child.tag)
            if key == "link" and child.attrib.get("href"):
                if child.attrib.get("rel", "alternate") == "alternate":
                    fields[key] = child.attrib["href"]
            elif key in {"title", "link", "pubdate", "published", "updated", "date", "description", "summary", "content"}:
                fields[key] = "".join(child.itertext())
        items.append({
            "title": clean_text(fields.get("title"), 300),
            "url": fields.get("link", "").strip(),
            "published_at": fields.get("published") or fields.get("pubdate") or fields.get("updated") or fields.get("date", ""),
            "summary": clean_text(fields.get("description") or fields.get("summary") or fields.get("content"), 900),
        })
    return items


def relevant(text: str) -> bool:
    competition = re.search(r"大赛|竞赛|比赛|挑战赛|ctf|contest|competition", text, re.I)
    domain = re.search(r"ctf|取证|网络安全|信息安全|软件|计算机|人工智能|大数据|电子设计|数学建模|创新创业|公安|警务|反诈|数字媒体", text, re.I)
    return bool(competition and domain)


def make_event(raw: dict[str, Any], whitelist: list[dict[str, Any]], projects: list[dict[str, Any]], now: datetime) -> dict[str, Any] | None:
    title = clean_text(raw.get("title"), 300)
    summary = clean_text(raw.get("summary"), 700)
    url = canonical_url(str(raw.get("url", "")))
    if not title or not url:
        return None
    source = str(raw.get("source", "公开网页"))
    text = f"{title} {summary}"
    if source != "CTFtime" and not relevant(text):
        return None
    published_at = iso_datetime(raw.get("published_at")) or now.isoformat().replace("+00:00", "Z")
    deadline, confidence = extract_registration_deadline(text, published_at)
    whitelist_ids = match_whitelist(text, whitelist)
    matched_projects = project_names_for(whitelist_ids, text, projects)
    event_start = iso_datetime(raw.get("event_start"))
    event_end = iso_datetime(raw.get("event_end"))
    return {
        "id": "event-" + hashlib.sha1(url.encode("utf-8")).hexdigest()[:16],
        "title": title,
        "category": classify(text),
        "url": url,
        "source": source,
        "source_kind": raw.get("source_kind", "公开网页"),
        "whitelist": bool(whitelist_ids),
        "whitelist_ids": whitelist_ids,
        "school_status": None,
        "status": "open" if deadline and deadline >= now.strftime("%Y-%m-%d") else "monitoring",
        "registration_deadline": deadline,
        "deadline_confidence": confidence,
        "event_start": event_start,
        "event_end": event_end,
        "published_at": published_at,
        "discovered_at": now.isoformat().replace("+00:00", "Z"),
        "matched_projects": matched_projects,
        "match_score": score_event(whitelist_ids, matched_projects, deadline, source == "CTFtime"),
        "summary": summary or "公开来源暂未提供摘要，请打开原文核对赛制与报名时间。",
        "analysis_mode": "rules",
        "ai_confidence": None,
        "recommendation_reason": "命中你的项目储备" if matched_projects else "命中赛事关键词",
    }


def fetch_ctftime(now: datetime, whitelist: list[dict[str, Any]], projects: list[dict[str, Any]]) -> list[dict[str, Any]]:
    start = int((now - timedelta(days=3)).timestamp())
    finish = int((now + timedelta(days=240)).timestamp())
    url = f"https://ctftime.org/api/v1/events/?limit=100&start={start}&finish={finish}"
    payload = json.loads(http_get(url).decode("utf-8"))
    events = []
    for item in payload:
        raw = {
            "title": item.get("title"),
            "summary": item.get("description"),
            "url": item.get("ctftime_url") or item.get("url"),
            "published_at": item.get("start"),
            "event_start": item.get("start"),
            "event_end": item.get("finish"),
            "source": "CTFtime",
            "source_kind": "赛事日历 API",
        }
        event = make_event(raw, whitelist, projects, now)
        if event:
            events.append(event)
    return events


def fetch_search(query: str, source: str, now: datetime, whitelist: list[dict[str, Any]], projects: list[dict[str, Any]]) -> list[dict[str, Any]]:
    url = "https://www.bing.com/search?" + urllib.parse.urlencode({"format": "rss", "count": "30", "q": query})
    items = parse_feed(http_get(url))
    events = []
    for item in items:
        item.update({"source": source, "source_kind": "公开搜索 RSS"})
        if "mp.weixin.qq.com" in item.get("url", ""):
            item["source_kind"] = "微信公众号公开索引"
        event = make_event(item, whitelist, projects, now)
        if event:
            events.append(event)
    return events


def merge_events(current: list[dict[str, Any]], previous: list[dict[str, Any]], now: datetime) -> list[dict[str, Any]]:
    old_by_id = {item["id"]: item for item in previous if item.get("id")}
    seen = set()
    merged = []
    for item in current:
        old = old_by_id.get(item["id"])
        if old:
            item["discovered_at"] = old.get("discovered_at", item["discovered_at"])
            if old.get("analysis_mode") == "ai":
                for key in ("summary", "category", "matched_projects", "recommendation_reason", "analysis_mode", "ai_confidence"):
                    item[key] = old.get(key, item.get(key))
        if item["id"] not in seen:
            merged.append(item)
            seen.add(item["id"])
    for old in previous:
        if old.get("id") in seen:
            continue
        dates = [old.get("registration_deadline"), (old.get("event_end") or "")[:10], (old.get("published_at") or "")[:10]]
        dates = [d for d in dates if d]
        if dates and max(dates) < (now - timedelta(days=120)).strftime("%Y-%m-%d"):
            continue
        merged.append(old)
        seen.add(old.get("id"))
    merged.sort(key=lambda x: x.get("published_at") or x.get("discovered_at") or "", reverse=True)
    return merged[:250]


def extract_json_array(content: str) -> list[dict[str, Any]]:
    text = content.strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.I)
    start, end = text.find("["), text.rfind("]")
    if start < 0 or end <= start:
        raise ValueError("AI response is not a JSON array")
    value = json.loads(text[start:end + 1])
    if not isinstance(value, list):
        raise ValueError("AI response is not a list")
    return value


def apply_ai(events: list[dict[str, Any]], projects: list[dict[str, Any]]) -> tuple[int, str]:
    api_key = os.getenv("CONTEST_AI_API_KEY", "").strip()
    base_url = (os.getenv("CONTEST_AI_BASE_URL") or "https://api.openai.com/v1").strip().rstrip("/")
    model = os.getenv("CONTEST_AI_MODEL", "").strip()
    candidates = [e for e in events if e.get("analysis_mode") != "ai"][:12]
    if not candidates:
        return 0, "rules"
    if not api_key or not model:
        return 0, "rules"
    allowed_categories = {"电子取证", "CTF / 网安", "作品赛", "AI / 大数据", "程序设计", "综合竞赛"}
    project_names = {p["name"] for p in projects}
    prompt_items = [{
        "id": e["id"], "title": e["title"], "text": e["summary"],
        "rule_category": e["category"], "matched_projects": e["matched_projects"],
    } for e in candidates]
    body = json.dumps({
        "model": model,
        "temperature": 0.1,
        "messages": [
            {"role": "system", "content": "你是竞赛情报编辑。只依据输入文本分析，不补写日期、链接或事实。输出纯 JSON 数组，每项含 id、summary、category、matched_projects、recommendation_reason、confidence。category 只能是：电子取证、CTF / 网安、作品赛、AI / 大数据、程序设计、综合竞赛。matched_projects 只能使用输入已有项目；没有就空数组。summary 限 120 字并明确这是原文信息还是待核实线索。"},
            {"role": "user", "content": json.dumps(prompt_items, ensure_ascii=False)},
        ],
    }, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(base_url + "/chat/completions", data=body, headers={
        "Authorization": "Bearer " + api_key,
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
    })
    try:
        with urllib.request.urlopen(request, timeout=70) as response:
            payload = json.loads(response.read(MAX_RESPONSE_BYTES).decode("utf-8"))
        content = payload["choices"][0]["message"]["content"]
        analyses = {item.get("id"): item for item in extract_json_array(content)}
        by_id = {e["id"]: e for e in candidates}
        changed = 0
        for event_id, analysis in analyses.items():
            event = by_id.get(event_id)
            if not event:
                continue
            summary = clean_text(analysis.get("summary"), 180)
            category = analysis.get("category")
            reason = clean_text(analysis.get("recommendation_reason"), 100)
            names = analysis.get("matched_projects")
            if summary:
                event["summary"] = summary
            if category in allowed_categories:
                event["category"] = category
            if isinstance(names, list):
                event["matched_projects"] = [n for n in names if n in project_names][:4]
            if reason:
                event["recommendation_reason"] = reason
            confidence = analysis.get("confidence")
            event["ai_confidence"] = confidence if isinstance(confidence, (int, float)) else None
            event["analysis_mode"] = "ai"
            changed += 1
        return changed, "ai+rules" if changed else "rules"
    except Exception as exc:
        print(f"AI analysis skipped: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 0, "rules"


def meaningful_payload(data: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in data.items() if k != "generated_at"}


def build(offline: bool = False) -> dict[str, Any]:
    whitelist = read_json(WHITELIST_FILE, [])
    projects = read_json(PROJECTS_FILE, [])
    previous_data = read_json(OUTPUT, {})
    previous_events = previous_data.get("events", [])
    now = datetime.now(timezone.utc)
    current: list[dict[str, Any]] = []
    statuses = []

    if offline:
        statuses = previous_data.get("sources", []) or [{"name": "公开来源", "status": "pending", "count": 0, "detail": "等待首次定时采集"}]
        current = previous_events
    else:
        collectors = [("CTFtime", lambda: fetch_ctftime(now, whitelist, projects))]
        collectors.extend((name, lambda q=query, n=name: fetch_search(q, n, now, whitelist, projects)) for name, query in SEARCH_QUERIES)
        extra_feeds = [u.strip() for u in os.getenv("CONTEST_EXTRA_RSS", "").split(",") if u.strip()]
        for index, feed_url in enumerate(extra_feeds[:10], 1):
            def collect_extra(url: str = feed_url) -> list[dict[str, Any]]:
                events = []
                for item in parse_feed(http_get(url)):
                    item.update({"source": f"自定义 RSS {index}", "source_kind": "自定义 RSS"})
                    event = make_event(item, whitelist, projects, now)
                    if event:
                        events.append(event)
                return events
            collectors.append((f"自定义 RSS {index}", collect_extra))
        for name, collector in collectors:
            try:
                found = collector()
                current.extend(found)
                statuses.append({"name": name, "status": "ok", "count": len(found), "detail": "采集成功"})
                print(f"{name}: {len(found)} relevant events")
            except Exception as exc:
                statuses.append({"name": name, "status": "error", "count": 0, "detail": f"{type(exc).__name__}: {clean_text(exc, 140)}"})
                print(f"{name}: {type(exc).__name__}: {exc}", file=sys.stderr)
            time.sleep(0.25)
        current = merge_events(current, previous_events, now)

    if offline:
        ai_count = 0
        analysis_mode = previous_data.get("analysis", {}).get("mode", "rules")
    else:
        ai_count, analysis_mode = apply_ai(current, projects)
    today = now.strftime("%Y-%m-%d")
    urgent = [e for e in current if e.get("registration_deadline") and today <= e["registration_deadline"] <= (now + timedelta(days=30)).strftime("%Y-%m-%d")]
    data = {
        "generated_at": now.isoformat().replace("+00:00", "Z"),
        "analysis": {"mode": analysis_mode, "ai_analyzed": ai_count, "deadline_policy": "仅从原文提取，不由模型猜测"},
        "stats": {
            "whitelist": len(whitelist),
            "projects": len(projects),
            "events": len(current),
            "urgent": len(urgent),
            "wechat": sum(1 for e in current if e.get("source_kind") == "微信公众号公开索引"),
        },
        "events": current,
        "watchlist": build_watchlist(whitelist, projects),
        "projects": projects,
        "sources": statuses,
    }
    if previous_data and meaningful_payload(previous_data) == meaningful_payload(data):
        data["generated_at"] = previous_data.get("generated_at", data["generated_at"])
    return data


def main() -> int:
    parser = argparse.ArgumentParser(description="Build contest-radar data from public sources")
    parser.add_argument("--offline", action="store_true", help="Rebuild static profiles without network requests")
    args = parser.parse_args()
    data = build(offline=args.offline)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    temporary = OUTPUT.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(OUTPUT)
    print(f"Wrote {OUTPUT}: {len(data['events'])} events, {len(data['watchlist'])} whitelist entries")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
