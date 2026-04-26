---
title: Stable Diffusion 生成手册
date: "2026-04-26 19:44:05"
permalink: '/2026/04/26/博览知识/Stable-Diffusion-生成手册/'
categories:
  - 博览知识
tags:
  - 博览知识
  - Stable Diffusion
  - AI视频
created: "2026-04-26T19:44"
updated: "2026-04-26T19:44"
---

## 基础结论

本地 Stable Diffusion WebUI 需要保持后端服务运行，Codex 通过 WebUI API 调用生成图片和视频。浏览器页面可以关闭，但启动 WebUI 的程序窗口不能关闭；否则 `http://127.0.0.1:7860/sdapi/v1/` API 无法继续响应。

当前机器配置为 64GB 内存、约 24GB 显存，适合正常高显存工作流，不建议使用 `lowvram` 或 `medvram`。启动参数建议保留：

```text
--api --opt-sdp-attention
```

其中 `--api` 是 Codex 调用 WebUI 的关键参数。

## 当前可用模型与插件

人像写实生成可优先使用：

```text
majicMIX realistic 麦橘写实_v7.safetensors
```

AnimateDiff 运动模型推荐：

```text
v3_sd15_mm.ckpt
```

备用稳定模型：

```text
mm_sd_v15_v2.ckpt
```

SDXL 专用模型：

```text
mm_sdxl_v10_beta.ckpt
```

注意：SD1.5 模型如 majicMIX realistic 应优先搭配 SD1.5 运动模型，不要混用 SDXL 运动模型。

## 文生图推荐流程

人像生成先把“脸、构图、光线、画面质量”定下来，再考虑动起来。示例负面提示词：

```text
(worst quality:2),(low quality:2),(normal quality:2),lowres,watermark
```

majicMIX realistic v7 的基础写实人像参数可从下面开始：

```text
Sampler: Euler a
Steps: 30
CFG Scale: 7
Size: 512x768
Hires.fix: 开
Hires upscaler: ESRGAN_4x
Hires scale: 2
Hires steps: 16
Hires denoising strength: 0.35
Clip skip: 2
Restore faces: 关
```

WebUI 中文界面里，`denoising_strength` 对应 **重绘幅度**。

在文生图页面里，重绘幅度通常藏在：

```text
文生图 -> 高分辨率修复 (Hires. fix) -> 重绘幅度
```

在图生图页面里，重绘幅度通常在主参数区直接显示。

## 文生视频还是图生视频

如果目标是人像成片质量，推荐：

```text
文生图 -> 图生视频 -> 插帧 -> 必要时再放大
```

原因是人像视频最怕脸漂、衣服漂、背景漂。先文生图可以先确定人物身份和构图，再用图生视频让画面动起来，最终更像“这张图活了”。

直接文生视频适合快速找动作灵感，但人物一致性更难控制。

## 图生视频基础参数

以“女孩转头看向镜头笑，5 秒”为例，推荐从保守参数开始：

```text
Motion model: v3_sd15_mm.ckpt
Number of frames: 16 或 24
FPS: 8 或 12
Denoising strength: 0.24 - 0.36
Closed loop: N
Frame Interpolation: FILM
Interp X: 3
```

如果想直接生成更完整的 5 秒动作：

```text
Number of frames: 40
FPS: 8
Denoising strength: 0.28 - 0.36
```

如果显存和速度允许，也可以提高到：

```text
Number of frames: 40
FPS: 24
Frame Interpolation: FILM
Interp X: 3
```

但实际操作里，更稳的方案通常是先生成低帧率视频，再插帧到 24fps。

## Denoising Strength 怎么选

`Denoising strength` 越低，越保留原图；越高，动作和变化越大，但脸和身份更容易漂。

高清修复时：

```text
0.05 - 0.20：极度保守，基本保留原图
0.20 - 0.35：常用范围，画质提升且不太改脸
0.35 - 0.50：变化更明显，可能改五官和衣服
```

图生视频时：

```text
0.18 - 0.25：稳定优先，动作较小
0.25 - 0.35：推荐范围，动作和稳定性比较平衡
0.35 - 0.50：动作更大，但脸漂风险明显增加
```

如果想让人物运动幅度更大，优先逐步增加到 `0.32 - 0.36`，不要一开始就拉到 `0.5` 以上。

## 帧数、帧率与时长

视频时长由下面公式决定：

```text
时长 = 总帧数 / FPS
```

例如：

```text
16 frames / 8 fps = 2 秒
24 frames / 8 fps = 3 秒
40 frames / 8 fps = 5 秒
120 frames / 24 fps = 5 秒
```

真实生成时，不必一开始就直接生成 120 帧。更实用的做法是：

```text
先生成 16-40 帧、8fps 的稳定视频
再通过 FILM/RIFE 插帧到 24fps
最后导出为 5 秒 MP4
```

## FILM 插帧参数

AnimateDiff 里的 `Frame Interpolation` 选 `FILM`，`Interp X` 填插帧倍数，不是直接填目标 fps。

换算方式：

```text
Interp X = 目标 FPS / 原始 FPS
```

例如原始 8fps 想补到 24fps：

```text
24 / 8 = 3
```

所以填写：

```text
Frame Interpolation: FILM
Interp X: 3
```

常用建议：

```text
X = 2：轻量插帧
X = 3：推荐，8fps 到 24fps
X = 4：更丝滑，但更慢，也更可能出现插帧幻影
X = 10：不建议日常使用，容易慢且糊影明显
```

## Closed Loop 怎么选

`Closed loop` 控制视频是否尝试首尾循环。

对“转头看镜头笑”这类有明确起点和终点的动作，推荐：

```text
Closed loop: N
```

常见含义：

```text
N：不闭环，适合转头、看镜头、微笑、短动作
R-P：轻微减少首尾跳变，适合不强求无缝的小循环
R+P：更偏循环，适合呼吸、发丝飘动、光影变化
A：强行闭环，不建议人脸动作，容易回弹或鬼畜
```

## 提高视频质量的顺序

建议每次只改一个关键变量，方便判断问题来源：

1. 先确定一张高质量文生图。
2. 用图生视频小参数试动作。
3. 如果动作太小，逐步提高 `denoising strength`。
4. 如果脸漂，降低 `denoising strength`，或缩短帧数。
5. 如果不流畅，先保持低 fps 生成，再插帧到 24fps。
6. 如果出现彩色噪点、雪花、画面碎裂，换运动模型或降低帧数、降低重绘幅度。
7. 成片后再用 ffmpeg 或 WebUI 插件导出 MP4。

## 常见问题

### 为什么不要开脸部修复

脸部修复可能会把每一帧的人脸当作独立图片重新修，导致视频里脸不断变化。人像视频更看重帧间一致性，因此除非脸严重坏掉，否则不建议开。

### 为什么直接高帧率生成不一定更好

高帧数会显著增加生成压力，也更容易出现身份漂移和画面累计误差。先低帧率生成稳定动作，再插帧，通常比直接硬生成高帧率更稳。

### 为什么动作幅度不够

常见原因是 `denoising strength` 太低、提示词动作不明确，或者总帧数太短。可以尝试：

```text
slowly turns head toward camera
looking into camera
warm gentle smile
subtle blinking
```

并把 `denoising strength` 从 `0.24` 提到 `0.30`、`0.34` 逐步测试。

### 为什么画面会漂

常见原因是重绘幅度太高、帧数太长、提示词过复杂，或者运动模型与底模不匹配。解决顺序：

```text
降低 denoising strength
减少 Number of frames
使用 SD1.5 对应运动模型
简化提示词
先做短视频草稿
```

## 推荐默认模板

写实人像图生视频可以从这个模板开始：

```text
Checkpoint: majicMIX realistic 麦橘写实_v7
Prompt: 1girl, same girl, slowly turns head toward camera, looking into camera, warm gentle smile, subtle blinking, realistic portrait, soft daylight, stable face, stable body
Negative: (worst quality:2),(low quality:2),(normal quality:2),lowres,watermark,bad face, distorted face, deformed eyes, extra fingers, flicker, artifacts
Sampler: Euler a
Steps: 20 - 30
CFG Scale: 6 - 7
Motion model: v3_sd15_mm.ckpt
Number of frames: 24 或 40
FPS: 8
Denoising strength: 0.28 - 0.36
Closed loop: N
Frame Interpolation: FILM
Interp X: 3
```

核心原则：**先稳，再动，再流畅**。
