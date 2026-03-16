---
title: "linux工具"
date: 2026-03-15 13:28:28
categories:
- Forensic_电子取证
- Forensic解题妙具
---

| <font style="color:rgb(15, 17, 21);">工具名称</font> | <font style="color:rgb(15, 17, 21);">主要功能</font> | <font style="color:rgb(15, 17, 21);">简介</font> |
| --- | --- | --- |
| **<font style="color:rgb(15, 17, 21);">Binwalk</font>** | **<font style="color:rgb(15, 17, 21);">固件/文件分析提取</font>** | <font style="color:rgb(15, 17, 21);">核心工具。用于分析、逆向工程固件镜像，识别并提取内嵌的文件和代码。</font> |
| **<font style="color:rgb(15, 17, 21);">Foremost</font>** | **<font style="color:rgb(15, 17, 21);">文件雕刻</font>** | <font style="color:rgb(15, 17, 21);">基于文件头尾（文件签名）从原始磁盘镜像或文件中恢复已删除的文件。</font> |
| **<font style="color:rgb(15, 17, 21);">Sleuth Kit</font>** | **<font style="color:rgb(15, 17, 21);">磁盘取证分析</font>** | **<font style="color:rgb(15, 17, 21);">命令行</font>**<font style="color:rgb(15, 17, 21);">套件，用于分析磁盘镜像、恢复文件、分析文件系统元数据。</font> |
| **<font style="color:rgb(15, 17, 21);">Autopsy</font>** | **<font style="color:rgb(15, 17, 21);">磁盘取证分析</font>** | **<font style="color:rgb(15, 17, 21);">Sleuth Kit 的图形化界面</font>**<font style="color:rgb(15, 17, 21);">，非常强大，是开源取证平台的标杆。</font> |
| **<font style="color:rgb(15, 17, 21);">Guymager</font>** | **<font style="color:rgb(15, 17, 21);">磁盘镜像采集</font>** | <font style="color:rgb(15, 17, 21);">轻量、快速、开源的磁盘镜像制作工具，用于创建物理磁盘的 DD 或 E01 格式镜像。</font> |
| **<font style="color:rgb(15, 17, 21);">Bulk Extractor</font>** | **<font style="color:rgb(15, 17, 21);">信息提取</font>** | <font style="color:rgb(15, 17, 21);">快速从镜像中扫描并提取大量信息（如电子邮件、URL、信用卡号、电话号码等）。</font> |
| **<font style="color:rgb(15, 17, 21);">strings</font>** | **<font style="color:rgb(15, 17, 21);">字符串提取</font>** | <font style="color:rgb(15, 17, 21);">系统自带，从二进制文件中提取可读字符串，是初步分析的必备步骤。</font> |


---

### <font style="color:rgb(15, 17, 21);">二、按类别详细推荐</font>
#### <font style="color:rgb(15, 17, 21);">1. 磁盘镜像与采集</font>
| <font style="color:rgb(15, 17, 21);">工具</font> | <font style="color:rgb(15, 17, 21);">安装命令</font> | <font style="color:rgb(15, 17, 21);">用途</font> |
| --- | --- | --- |
| **<font style="color:rgb(15, 17, 21);">Guymager</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install guymager</font>` | <font style="color:rgb(15, 17, 21);">创建 DD/EWF(E01) 格式镜像，图形化，速度快。</font> |
| **<font style="color:rgb(15, 17, 21);">dcfldd</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install dcfldd</font>` | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">dd</font>`<br/><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的增强版，提供哈希校验和进度显示。</font> |
| **<font style="color:rgb(15, 17, 21);">FTK Imager</font>** | <font style="color:rgb(15, 17, 21);">(需从 AccessData 官网下载</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">.deb</font>`<br/><font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">包)</font> | <font style="color:rgb(15, 17, 21);">经典的闭源工具，Linux 版可用，业界标准。</font> |


#### <font style="color:rgb(15, 17, 21);">2. 文件系统与磁盘分析</font>
| <font style="color:rgb(15, 17, 21);">工具</font> | <font style="color:rgb(15, 17, 21);">安装命令</font> | <font style="color:rgb(15, 17, 21);">用途</font> |
| --- | --- | --- |
| **<font style="color:rgb(15, 17, 21);">The Sleuth Kit (+ Autopsy)</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install sleuthkit autopsy</font>` | <font style="color:rgb(15, 17, 21);">分析文件系统、时间线分析、文件恢复。</font> |
| **<font style="color:rgb(15, 17, 21);">X-Ways Forensics</font>** | <font style="color:rgb(15, 17, 21);">(Windows 软件，需 Wine)</font> | <font style="color:rgb(15, 17, 21);">顶级闭源工具，功能极其强大，可在 Linux 下通过 Wine 运行。</font> |


#### <font style="color:rgb(15, 17, 21);">3. 文件雕刻与恢复</font>
| <font style="color:rgb(15, 17, 21);">工具</font> | <font style="color:rgb(15, 17, 21);">安装命令</font> | <font style="color:rgb(15, 17, 21);">用途</font> |
| --- | --- | --- |
| **<font style="color:rgb(15, 17, 21);">Foremost</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install foremost</font>` | <font style="color:rgb(15, 17, 21);">经典的文件雕刻工具。</font> |
| **<font style="color:rgb(15, 17, 21);">Scalpel</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install scalpel</font>` | <font style="color:rgb(15, 17, 21);">Foremost 的继承者，性能更好，配置文件更灵活。</font> |
| **<font style="color:rgb(15, 17, 21);">TestDisk/PhotoRec</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install testdisk</font>` | **<font style="color:rgb(15, 17, 21);">PhotoRec</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">尤其强大，能恢复多种格式的已删除文件。</font> |


#### <font style="color:rgb(15, 17, 21);">4. 内存取证</font>
| <font style="color:rgb(15, 17, 21);">工具</font> | <font style="color:rgb(15, 17, 21);">安装命令</font> | <font style="color:rgb(15, 17, 21);">用途</font> |
| --- | --- | --- |
| **<font style="color:rgb(15, 17, 21);">Volatility</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install volatility</font>` | **<font style="color:rgb(15, 17, 21);">内存取证事实上的标准</font>**<font style="color:rgb(15, 17, 21);">。分析内存转储，提取进程、网络连接、密码哈希等。</font> |
| **<font style="color:rgb(15, 17, 21);">Volatility 3</font>** | <font style="color:rgb(15, 17, 21);">(需从 GitHub 下载)</font> | <font style="color:rgb(15, 17, 21);">Volatility 的下一代版本，性能和分析能力更强。</font> |


#### <font style="color:rgb(15, 17, 21);">5. 网络取证</font>
| <font style="color:rgb(15, 17, 21);">工具</font> | <font style="color:rgb(15, 17, 21);">安装命令</font> | <font style="color:rgb(15, 17, 21);">用途</font> |
| --- | --- | --- |
| **<font style="color:rgb(15, 17, 21);">Wireshark/TShark</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install wireshark</font>` | <font style="color:rgb(15, 17, 21);">著名的网络协议分析器，用于分析 pcap 文件。</font> |
| **<font style="color:rgb(15, 17, 21);">Xplico</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install xplico</font>` | <font style="color:rgb(15, 17, 21);">从 pcap 流量中提取应用数据（如 HTTP 图片、邮件、VoIP 通话）。</font> |


#### <font style="color:rgb(15, 17, 21);">6. 移动设备与数据库取证</font>
| <font style="color:rgb(15, 17, 21);">工具</font> | <font style="color:rgb(15, 17, 21);">安装命令</font> | <font style="color:rgb(15, 17, 21);">用途</font> |
| --- | --- | --- |
| **<font style="color:rgb(15, 17, 21);">DB Browser for SQLite</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install sqlitebrowser</font>` | <font style="color:rgb(15, 17, 21);">查看和分析 SQLite 数据库文件（大量应用使用）。</font> |
| **<font style="color:rgb(15, 17, 21);">libimobiledevice</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install libimobiledevice-utils</font>` | <font style="color:rgb(15, 17, 21);">用于与 iOS 设备通信，获取基本信息。</font> |


#### <font style="color:rgb(15, 17, 21);">7. 恶意软件分析</font>
| <font style="color:rgb(15, 17, 21);">工具</font> | <font style="color:rgb(15, 17, 21);">安装命令</font> | <font style="color:rgb(15, 17, 21);">用途</font> |
| --- | --- | --- |
| **<font style="color:rgb(15, 17, 21);">YARA</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install yara</font>` | <font style="color:rgb(15, 17, 21);">模式匹配工具，用于识别和分类恶意软件。</font> |
| **<font style="color:rgb(15, 17, 21);">ClamAV</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install clamav</font>` | <font style="color:rgb(15, 17, 21);">开源反病毒引擎，可用于初步扫描。</font> |
| **<font style="color:rgb(15, 17, 21);">Radare2</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install radare2</font>` | <font style="color:rgb(15, 17, 21);">强大的开源逆向工程框架。</font> |
| **<font style="color:rgb(15, 17, 21);">Ghidra</font>** | <font style="color:rgb(15, 17, 21);">(需从 NSA 官网下载)</font> | <font style="color:rgb(15, 17, 21);">美国国安局发布的强大逆向工程工具，可与 IDA Pro 媲美。</font> |


#### <font style="color:rgb(15, 17, 21);">8. 图片与多媒体分析</font>
| <font style="color:rgb(15, 17, 21);">工具</font> | <font style="color:rgb(15, 17, 21);">安装命令</font> | <font style="color:rgb(15, 17, 21);">用途</font> |
| --- | --- | --- |
| **<font style="color:rgb(15, 17, 21);">ExifTool</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install libimage-exiftool-perl</font>` | <font style="color:rgb(15, 17, 21);">读取、写入和编辑多种文件的元信息（如 JPEG 的 GPS 坐标）。</font> |
| **<font style="color:rgb(15, 17, 21);">Aftershot</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">/</font><font style="color:rgb(15, 17, 21);"> </font>**<font style="color:rgb(15, 17, 21);">GIMP</font>** | `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">sudo apt install gimp</font>` | <font style="color:rgb(15, 17, 21);">查看和分析图片文件。</font> |


