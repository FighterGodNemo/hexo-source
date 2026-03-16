---
title: "自动修复zip伪加密"
date: 2026-03-15 13:28:28
categories:
- Forensic_电子取证
- Forensic解题妙具
---

ZipCenOp.jar

java -jar ZipCenOp.jar r lm.zip







文件格式签名（File Signature 或 Magic Number）是文件开头的特定字节序列，用于标识文件的类型。以下是一些常见文件格式的签名（十六进制表示）：



1. 压缩文件

ZIP: 50 4B 03 04 (PK..)

RAR: 52 61 72 21 (Rar!)

7z: 37 7A BC AF 27 1C (7z¼¯')

GZIP: 1F 8B

TAR: 75 73 74 61 72 (ustar)

2. 图片文件

JPEG/JPG: FF D8 FF E0 或 FF D8 FF E1

PNG: 89 50 4E 47 0D 0A 1A 0A (‰PNG....)

GIF: 47 49 46 38 (GIF8)

BMP: 42 4D (BM)

WebP: 52 49 46 46 (RIFF) + 57 45 42 50 (WEBP)

TIFF: 49 49 2A 00 (小端) 或 4D 4D 00 2A (大端)

3. 文档文件

PDF: 25 50 44 46 (%PDF)

Microsoft Office (DOCX/XLSX/PPTX): 50 4B 03 04 (本质是ZIP格式)

Word (DOC): D0 CF 11 E0 (ÐÏ.à)

Excel (XLS): D0 CF 11 E0 (ÐÏ.à)

PowerPoint (PPT): D0 CF 11 E0 (ÐÏ.à)

4. 可执行文件

Windows PE (EXE/DLL): 4D 5A (MZ)

Linux ELF: 7F 45 4C 46 (ELF)

Mach-O (macOS): FE ED FA CE 或 CF FA ED FE

5. 音频/视频文件

MP3: 49 44 33 (ID3) 或 FF FB

WAV: 52 49 46 46 (RIFF) + 57 41 56 45 (WAVE)

AVI: 52 49 46 46 (RIFF) + 41 56 49 20 (AVI )

MP4: 00 00 00 20 66 74 79 70 (....ftyp)

FLV: 46 4C 56 01 (FLV.)

6. 数据库文件

SQLite: 53 51 4C 69 74 65 (SQLite)

MySQL Dump: 2D 2D 20 4D 79 53 51 4C (-- MySQL)

7. 其他常见格式

HTML: 3C 21 44 4F 43 54 59 50 45 (<!DOCTYPE)

XML: 3C 3F 78 6D 6C (<?xml)

JSON: 7B ({) 或 5B ([)

ISO (光盘镜像): 43 44 30 30 31 (CD001)

