import importlib.util
import unittest
from datetime import datetime, timezone
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("collect.py")
SPEC = importlib.util.spec_from_file_location("contest_radar_collect", MODULE_PATH)
radar = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(radar)


class ContestRadarTests(unittest.TestCase):
    def setUp(self):
        self.whitelist = [
            {"id": 25, "name": "全国大学生信息安全竞赛", "department": "", "school_status": "未标注"},
            {"id": 38, "name": "全国大学生信息安全与对抗技术竞赛", "department": "", "school_status": "未标注"},
        ]
        self.projects = [{
            "id": "suimai",
            "name": "溯脉",
            "status": "MVP 已验收",
            "summary": "日志取证平台",
            "tags": ["电子取证"],
            "competition_ids": [25, 38],
            "evidence": "测试记录",
        }]
        self.now = datetime(2026, 10, 28, tzinfo=timezone.utc)

    def test_extracts_explicit_registration_deadline(self):
        date, confidence = radar.extract_registration_deadline("报名截止时间为2026年11月5日，逾期不予受理。")
        self.assertEqual(date, "2026-11-05")
        self.assertEqual(confidence, "high")

    def test_extracts_registration_range_end(self):
        date, confidence = radar.extract_registration_deadline("报名时间：2026年10月1日至10月20日。", "2026-09-30T00:00:00Z")
        self.assertEqual(date, "2026-10-20")
        self.assertEqual(confidence, "medium")

    def test_does_not_use_event_date_as_registration_deadline(self):
        date, confidence = radar.extract_registration_deadline("比赛将于2026年11月8日举行，欢迎参加。")
        self.assertIsNone(date)
        self.assertIsNone(confidence)

    def test_whitelist_aliases_and_project_matching(self):
        text = "第十九届 CISCN 作品赛启动，适合日志攻击链与电子取证方向"
        ids = radar.match_whitelist(text, self.whitelist)
        self.assertEqual(ids, [25])
        self.assertIn("溯脉", radar.project_names_for(ids, text, self.projects))

    def test_rejects_irrelevant_search_result(self):
        raw = {"title": "普通校园歌唱比赛", "summary": "文艺活动通知", "url": "https://example.com/singing", "published_at": "2026-10-01T00:00:00Z"}
        self.assertIsNone(radar.make_event(raw, self.whitelist, self.projects, self.now))

    def test_builds_relevant_event_without_inventing_deadline(self):
        raw = {"title": "示例电子数据取证大赛报名通知", "summary": "本届比赛包括手机与计算机取证，具体日程见原文。", "url": "https://example.com/forensic?utm_source=rss&id=7", "published_at": "2026-10-20T00:00:00Z"}
        event = radar.make_event(raw, self.whitelist, self.projects, self.now)
        self.assertEqual(event["category"], "电子取证")
        self.assertIsNone(event["registration_deadline"])
        self.assertEqual(event["url"], "https://example.com/forensic?id=7")
        self.assertIn("溯脉", event["matched_projects"])

    def test_merge_preserves_discovery_and_ai_analysis(self):
        raw = {"title": "CTF 网络安全大赛报名", "summary": "公开比赛通知", "url": "https://example.com/ctf", "published_at": "2026-10-20T00:00:00Z"}
        current = radar.make_event(raw, [], [], self.now)
        previous = dict(current, discovered_at="2026-10-01T00:00:00Z", analysis_mode="ai", summary="已核实摘要")
        merged = radar.merge_events([current], [previous], self.now)
        self.assertEqual(merged[0]["discovered_at"], "2026-10-01T00:00:00Z")
        self.assertEqual(merged[0]["summary"], "已核实摘要")

    def test_generated_time_does_not_count_as_content_change(self):
        first = {"generated_at": "2026-10-28T00:00:00Z", "events": [1]}
        second = {"generated_at": "2026-10-29T00:00:00Z", "events": [1]}
        self.assertEqual(radar.meaningful_payload(first), radar.meaningful_payload(second))

    def test_extracts_ai_json_from_code_fence(self):
        value = radar.extract_json_array('```json\n[{"id":"event-1"}]\n```')
        self.assertEqual(value, [{"id": "event-1"}])

    def test_real_profiles_have_expected_sizes(self):
        whitelist = radar.read_json(radar.WHITELIST_FILE, [])
        projects = radar.read_json(radar.PROJECTS_FILE, [])
        self.assertEqual(len(whitelist), 55)
        self.assertEqual(len(projects), 10)
        self.assertEqual(len({item["id"] for item in whitelist}), 55)


if __name__ == "__main__":
    unittest.main()
