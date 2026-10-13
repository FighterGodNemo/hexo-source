---
created: 2026-10-13T12:39
updated: 2026-10-13T12:39
title: BIOS 系统研究
permalink: /2026/10/13/博览知识/BIOS系统研究/
categories:
  - 博览知识
---
## 一句话定义
BIOS 是固化在计算机主板 ROM/Flash 芯片上的一组底层固件程序，是个人电脑启动时加载的第一个软件，负责为操作系统与硬件之间提供最底层、最直接的接口，充当「软件与硬件之间的转换器」。术语最早于 1975 年出现在 CP/M 操作系统中。（来源：百度百科、科普中国）

## 核心功能
BIOS 主要包含两大部分：
1. **自检及初始化**
   - 加电自检（POST，Power-On Self Test）：开机时检测 CPU、内存、ROM、CMOS、串并口、显卡、磁盘子系统、键盘等硬件是否正常；发现问题时给出提示信息或蜂鸣警告
   - 初始化：创建中断向量、设置寄存器、初始化外部设备；读取 CMOS 中的硬件参数并与实际硬件比较
   - 引导程序：从启动设备（软盘/硬盘）读取引导记录（MBR），找到后把控制权交给引导记录，由其加载操作系统
2. **程序服务处理与硬件中断处理**
   - 为应用程序和操作系统提供 I/O 服务（读磁盘、打印输出等）
   - 处理硬件中断；现代操作系统大多会绕过 BIOS 抽象层直接控制硬件

## 启动流程（以 x86 传统 BIOS 为例）
权威流程（NIST SP 800-147）：
1. **BIOS Boot Block**：最先执行的固件，负责校验其余 BIOS 代码完整性，损坏时可提供恢复机制；在可信计算架构中作为 CRTM（信任根）
2. **POST（加电自检）**：初始化芯片组、CPU、内存等关键底层硬件
3. **加载并执行 Option ROM**：初始化显卡等扩展卡（显卡 BIOS 初始化图形处理器与显存）
4. **MBR（主引导记录）**：读取启动扇区
5. **Boot Loader（引导程序）** → 早期 OS 内核初始化 → 完整 OS 内核初始化 → 用户态进程 → 内核服务
- 传统 BIOS 通常在 16 位实模式（Real Mode）下执行

## 存储介质与芯片演进
BIOS 固件存储在**非易失性存储器**中（断电不丢失）：
| 阶段 | 芯片类型 | 特点 |
|------|----------|------|
| 早期 | ROM（只读存储器） | 出厂编程，无法更改 |
| 中期 | EPROM | 紫外线擦除后可重编程，通常被不透明封装密封视为永久 |
| 后期 | EEPROM | 可电擦写，无需从主板取下 |
| 现代 | NOR Flash（SPI 接口） | 速度更快、密度更高，尺寸小（固件通常仅几 MB）；USB 盘/SSD 同族技术 |
- 厂商：AMI、Award、Phoenix、Insyde、百敖（BYOSOFT）
- 固件大小：约 128KB ~ 8MB

## CMOS 与 BIOS 设置
- CMOS 是保存 BIOS 配置参数（系统时间、启动顺序、硬件参数等）的存储器，靠主板上的 **CMOS 电池**（纽扣电池）在断电时维持数据
- 进入 BIOS 设置：开机时按厂商设定的按键——F2 / F10 / F12 / F1 / Del 等；开机太快时可通过 Windows「高级启动 → 恢复设置 → UEFI 固件设置」进入
- 常见设置：启动顺序、启停硬件组件、系统时间日期、内存/CPU 参数、电源管理等
- BIOS 更新（刷写/Flash）：从厂商获取新固件刷入 Flash 芯片，修复漏洞、提升兼容性

## BIOS vs UEFI（关键对比）
| 维度 | 传统 BIOS | UEFI（统一可扩展固件接口） |
|------|-----------|---------------------------|
| 分区表 | MBR，32 位 LBA，最大约 2.2TB | GPT，理论最大 9.4ZB，当前硬件实际无限 |
| 启动方式 | 顺序硬件探测 + 中断调用，慢 | 直接读 EFI System Partition（ESP，FAT32），硬件初始化并行化，更快 |
| 运行模式 | 16 位实模式，x86-32 | 32/64 位模式，为 64 位系统设计；ARM（Apple Silicon 等）只用 UEFI |
| 界面 | 文本菜单 + 键盘 | 支持鼠标、图形界面、网络启动、HTTP/HTTPS 固件更新 |
| 安全 | 无密码学验证 | **Secure Boot**：用公钥密码学验证引导程序签名，阻止 bootkit/rootkit |
| 大容量盘 | 无法处理 3TB+ 驱动器 | 支持 NVMe 与大容量存储 |

## BIOS 安全
- BIOS/固件是病毒木马的目标，一旦被破坏后果严重
- 经典案例：**CIH 病毒**（1998 年）——首个能破坏硬件的病毒，擦除 BIOS Flash 内容 + 用垃圾数据覆盖硬盘引导区和分区表，「固件破坏 + 数据破坏」双管齐下；当时多数受害芯片本身完好，重刷 BIOS 即可修复
- 现代硬件防护升级：
  - 固件改存 SPI NOR Flash，由芯片组（PCH）内 SPI 控制器管理，CPU 不能直接访问；受保护寄存器（Protected Range Register）可锁定固件区读写权限
  - **Intel Boot Guard** / **AMD Platform Secure Boot**：CPU 微码层验证固件引导块签名，篡改则拒绝执行
  - **UEFI Secure Boot**：验证引导加载程序签名，签名不对拒绝执行
  - 固件更新签名强制 + 防回滚机制（Bootloader 校验固件包签名与哈希，禁止刷入有漏洞旧版本）
  - Windows 10/11 默认开启内核隔离、内存完整性（HVCI）、驱动签名强制
- 可信计算：BIOS Boot Block 作为 CRTM（Core Root of Trust for Measurement），是启动测量链的信任起点

## 工程防护建议
- Flash 分区规划：Bootloader 独立分区并写保护，应用区损坏可回退恢复
- 双备份策略：两个 Flash 分区存固件，先写备份区再切换启动标志
- 嵌入式产品：写保护引脚常态置保护，仅 OTA 升级时由 Bootloader 解除

## 参考资料
- 百度百科 - BIOS
- 科普中国 - 主板（BIOS 芯片）
- NIST SP 800-147 - BIOS Protection Guidelines
- SysTutorials - BIOS vs UEFI: Key Differences Explained
- HP 支持 - 如何在 Windows 个人电脑上进入 BIOS 设置
- ScienceInsights - Is BIOS Volatile Or Nonvolatile
- CSDN - CIH 病毒改写 BIOS 真相：固件安全与硬件防护全解析
*（内容由AI生成，仅供参考）*
