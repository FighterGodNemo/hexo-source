---
title: linux工具
date: "2026-03-15 13:28:28"
categories:
tags:
  - 电子取证
  - 取证工具
  - Linux
---

| 工具名称 | 主要功能 | 简介 |
| --- | --- | --- |
| **Binwalk** | **固件/文件分析提取** | 核心工具。用于分析、逆向工程固件镜像，识别并提取内嵌的文件和代码。 |
| **Foremost** | **文件雕刻** | 基于文件头尾（文件签名）从原始磁盘镜像或文件中恢复已删除的文件。 |
| **Sleuth Kit** | **磁盘取证分析** | **命令行**套件，用于分析磁盘镜像、恢复文件、分析文件系统元数据。 |
| **Autopsy** | **磁盘取证分析** | **Sleuth Kit 的图形化界面**，非常强大，是开源取证平台的标杆。 |
| **Guymager** | **磁盘镜像采集** | 轻量、快速、开源的磁盘镜像制作工具，用于创建物理磁盘的 DD 或 E01 格式镜像。 |
| **Bulk Extractor** | **信息提取** | 快速从镜像中扫描并提取大量信息（如电子邮件、URL、信用卡号、电话号码等）。 |
| **strings** | **字符串提取** | 系统自带，从二进制文件中提取可读字符串，是初步分析的必备步骤。 |


---

### 二、按类别详细推荐
#### 1. 磁盘镜像与采集
| 工具 | 安装命令 | 用途 |
| --- | --- | --- |
| **Guymager** | `sudo apt install guymager` | 创建 DD/EWF(E01) 格式镜像，图形化，速度快。 |
| **dcfldd** | `sudo apt install dcfldd` | `dd`<br/> 的增强版，提供哈希校验和进度显示。 |
| **FTK Imager** | (需从 AccessData 官网下载 `.deb`<br/> 包) | 经典的闭源工具，Linux 版可用，业界标准。 |


#### 2. 文件系统与磁盘分析
| 工具 | 安装命令 | 用途 |
| --- | --- | --- |
| **The Sleuth Kit (+ Autopsy)** | `sudo apt install sleuthkit autopsy` | 分析文件系统、时间线分析、文件恢复。 |
| **X-Ways Forensics** | (Windows 软件，需 Wine) | 顶级闭源工具，功能极其强大，可在 Linux 下通过 Wine 运行。 |


#### 3. 文件雕刻与恢复
| 工具 | 安装命令 | 用途 |
| --- | --- | --- |
| **Foremost** | `sudo apt install foremost` | 经典的文件雕刻工具。 |
| **Scalpel** | `sudo apt install scalpel` | Foremost 的继承者，性能更好，配置文件更灵活。 |
| **TestDisk/PhotoRec** | `sudo apt install testdisk` | **PhotoRec** 尤其强大，能恢复多种格式的已删除文件。 |


#### 4. 内存取证
| 工具 | 安装命令 | 用途 |
| --- | --- | --- |
| **Volatility** | `sudo apt install volatility` | **内存取证事实上的标准**。分析内存转储，提取进程、网络连接、密码哈希等。 |
| **Volatility 3** | (需从 GitHub 下载) | Volatility 的下一代版本，性能和分析能力更强。 |


#### 5. 网络取证
| 工具 | 安装命令 | 用途 |
| --- | --- | --- |
| **Wireshark/TShark** | `sudo apt install wireshark` | 著名的网络协议分析器，用于分析 pcap 文件。 |
| **Xplico** | `sudo apt install xplico` | 从 pcap 流量中提取应用数据（如 HTTP 图片、邮件、VoIP 通话）。 |


#### 6. 移动设备与数据库取证
| 工具 | 安装命令 | 用途 |
| --- | --- | --- |
| **DB Browser for SQLite** | `sudo apt install sqlitebrowser` | 查看和分析 SQLite 数据库文件（大量应用使用）。 |
| **libimobiledevice** | `sudo apt install libimobiledevice-utils` | 用于与 iOS 设备通信，获取基本信息。 |


#### 7. 恶意软件分析
| 工具 | 安装命令 | 用途 |
| --- | --- | --- |
| **YARA** | `sudo apt install yara` | 模式匹配工具，用于识别和分类恶意软件。 |
| **ClamAV** | `sudo apt install clamav` | 开源反病毒引擎，可用于初步扫描。 |
| **Radare2** | `sudo apt install radare2` | 强大的开源逆向工程框架。 |
| **Ghidra** | (需从 NSA 官网下载) | 美国国安局发布的强大逆向工程工具，可与 IDA Pro 媲美。 |


#### 8. 图片与多媒体分析
| 工具 | 安装命令 | 用途 |
| --- | --- | --- |
| **ExifTool** | `sudo apt install libimage-exiftool-perl` | 读取、写入和编辑多种文件的元信息（如 JPEG 的 GPS 坐标）。 |
| **Aftershot** / **GIMP** | `sudo apt install gimp` | 查看和分析图片文件。 |


