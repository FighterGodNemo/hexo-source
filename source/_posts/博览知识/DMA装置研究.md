---
created: 2026-10-13T12:39
updated: 2026-10-13T12:39
title: DMA 装置研究
permalink: /2026/10/13/博览知识/DMA装置研究/
categories:
  - 博览知识
---
## 一句话定义
DMA（Direct Memory Access，直接存储器存取）是一种通过专用硬件控制器实现存储器与外设之间直接数据传输的技术，无需中央处理器（CPU）全程介入。核心价值是让 CPU 从繁重的数据搬运中解放出来，在后台传输数据的同时继续执行其他任务。（来源：科普中国、百度百科、Techopedia）

## 为什么需要 DMA
- 早期方案下，CPU 必须逐步参与每次数据传输，中断与上下文切换的开销极大，导致 CPU 难以执行其他任务
- 典型场景：磁盘、网卡、显卡等设备的大批量数据传输，若全部经 CPU 逐字节搬移，CPU 将被完全占满
- DMA 出现后：设备驱动向 OS 申请 DMA 通道 → 配置传输参数 → DMA 控制器接管传输 → 完成后中断通知 CPU → 释放通道

## 工作原理与工作过程
核心工作流程（以总线型 DMA 为例）：
1. 外设准备好后，向 DMA 控制器发出传送请求信号 **DREQ**
2. DMA 控制器向 CPU 发出「总线请求」信号 **HOLD**，表示希望占用总线
3. CPU 完成当前总线周期后响应：将数据/地址/控制总线置为高阻态放弃总线控制权，并返回「总线响应」信号 **HLDA**
4. DMA 控制器接管总线，向外设发 DMA 应答信号
5. DMA 控制器送出存储器地址与控制信号，实现外设与内存（或内存与内存）之间的直接数据传送
6. DMA 控制器自动修改地址与字节计数器，重复直至传送完成；随后撤销 HOLD，CPU 恢复总线控制权继续执行原程序

DMA 控制器（DMAC）核心组件：
- 地址寄存器（Address Register）：记录数据读写的内存地址
- 数据寄存器（Data Register）：暂存正在传输的数据
- 计数寄存器（Count Register）：追踪剩余待传字节数
- 控制寄存器（Control Register）：指定传输模式、方向等参数
- 控制逻辑（Control Logic）：管理整个传输过程

## 三种传输模式
| 模式 | 行为 | 特点 |
|------|------|------|
| 突发模式（Burst） | 一次连续传输整块数据 | 传输最快，但期间独占总线 |
| 周期挪用（Cycle Stealing） | 每次传 1 字节/字后释放总线 | 与 CPU 交替使用总线，平衡性好 |
| 透明模式（Transparent） | 仅在 CPU 不用总线时传输 | 对 CPU 影响最小，速度最慢 |

## DMA vs 其他 I/O 方式
| 维度 | 程序控制 I/O（查询） | 中断驱动 I/O | DMA |
|------|---------------------|-------------|-----|
| 实现 | 轮询（polling） | 中断 | 硬件 DMA 控制器 |
| 中断次数 | 无 | 每个字节/字一次 | 整个传输结束一次 |
| CPU 效率 | 很低（忙等） | 中等 | 高 |
| 适用 | 简单设备、少量数据（传感器、LED、基础显示） | 键盘、鼠标、串/并口 | 大批量数据：硬盘/SSD、网卡、声卡、GPU |
| 中断 | 无 | 每字节/字中断 | 结束时中断一次 |

## 典型 DMA 装置应用
- 磁盘/SSD 控制器：大块数据读写
- 网络接口卡（NIC）：收发网络数据包
- 显卡（GPU）：显存与主存之间大流量搬运
- 声卡：音频流连续传输
- 嵌入式系统：传感器数据采集、外设批量交互

## DMA 与计算机网络（重点）
- 网卡收发数据天然依赖 DMA：数据包从网卡直接写入内存（RX DMA），或从内存直接发出（TX DMA），CPU 只需初始化描述符和处理完成中断
- **零拷贝（Zero-Copy）**：通过 DMA 直接在网卡缓冲与应用缓冲间搬移数据，避免多次内核态/用户态拷贝，显著降低延迟
- **内核旁路（Kernel Bypass）**：把网卡 DMA 与队列管理能力暴露给用户态，绕过传统内核协议栈
  - DPDK：Intel 主导，数据面开发套件，将 NIC 缓冲映射进应用内存，实现无拷贝收发包
  - RDMA（远程直接内存访问）：允许一端应用直接读写远端内存，基于 InfiniBand 等专用硬件，典型延迟在微秒级
  - Linux 的 AF_XDP 套接字、Solaris Crossbow 等系统级支持
  - 效果：单服务器可支撑每秒数千万包（tens of millions of packets per second）
- 硬件特性配合：多队列（multi-queue）、RSS（接收侧扩展）、硬件卸载（offload）等

## DMA 安全风险
- DMA 设备具有直接访问物理内存的能力，恶意/被攻陷的外设可借此读取任意内存内容（密码、加密密钥、文档），甚至注入代码
- 知名案例：**Thunderclap 攻击**（剑桥大学 RISE 团队）——利用 Thunderbolt/USB-C/Mini DisplayPort/PCIe 外设的 DMA 能力实施攻击，影响 2011 年后的 Apple 电脑及 2016 年后部分 Linux/Windows 设备
- 攻击场景：供应链投毒的 HDMI/Ethernet 转换器、电源适配器、USB-C 存储设备等
- 防护：**IOMMU（输入输出内存管理单元）**——为 DMA 建立地址翻译与访问隔离，类似虚拟内存对 CPU 的保护
  - 问题：早期 IOMMU 实现可被绕过，或因性能开销默认被操作系统禁用
  - 现代系统（如 VT-d / AMD-Vi）默认启用，配合驱动支持增强安全性

## 现代实现
- PCIe 时代的 DMA：设备作为**总线主控（Bus Master）**直接发起对主存的读写，无需传统 DMAC 中介
- **Scatter-Gather DMA**：支持不连续内存块的聚散传输，配合描述符链表（descriptor ring），是现代网卡/存储控制器标配
- FPGA/SoC 场景：AMD 等厂商提供 PCIe DMA IP（如 Scatter-Gather DMA、AXI4-MM/AXI4-Stream 接口），支持 64~512 位数据通路、多通道 H2C/C2H 传输
- 缓存一致性：DMA 传输涉及与 CPU 缓存的一致性协议协调（cache coherence）

## 参考资料
- 科普中国 - 直接存储器存取
- 百度百科 - 直接存储器存取（DMA）
- Techopedia - Direct Memory Access (DMA)
- TutorialsPoint - Operating System - Direct Memory Access
- EndlessWiki - Kernel Bypass Networking
- RISE (UK) - Thunderclap Case Study
- AMD - DMA for PCI Express Subsystem
*（内容由AI生成，仅供参考）*
