---
title: imei杂谈
date: 2026-03-15 13:28:28
categories:
  - Forensic_电子取证
  - Forensic知识
created: 2026-03-15T16:49
updated: 2026-03-18T09:45
---

+ **真实的IMEI是15位！**
+ <font style="color:rgb(15, 17, 21);background-color:rgb(237, 243, 254);">全局搜索，注意搜imei">而不是imei（避免误匹配）</font>



出现两个imei

### **1. 双卡双待设备（双SIM卡）**
+ **<font style="color:rgb(23, 23, 23);">原因</font>**<font style="color:rgb(64, 64, 64);">：  
</font><font style="color:rgb(64, 64, 64);">双卡双待手机（如支持双SIM卡的设备）通常有两个独立的SIM卡槽，每个SIM卡对应一个唯一的IMEI号码。</font>
    - **<font style="color:rgb(23, 23, 23);">主卡（Primary SIM）</font>**<font style="color:rgb(64, 64, 64);">：主SIM卡的IMEI通常显示为</font><font style="color:rgb(64, 64, 64);"> </font>**<font style="color:rgb(23, 23, 23);">IMSI</font>**<font style="color:rgb(64, 64, 64);">（国际移动用户识别码）的一部分。</font>
    - **<font style="color:rgb(23, 23, 23);">副卡（Secondary SIM）</font>**<font style="color:rgb(64, 64, 64);">：副卡的IMEI可能被系统隐藏，但通过特定工具（如</font>`<font style="color:rgb(64, 64, 64);background-color:rgb(245, 245, 245);">*#06#</font>`<font style="color:rgb(64, 64, 64);">指令）或软件可以查看。</font>
+ **<font style="color:rgb(23, 23, 23);">验证方法</font>**<font style="color:rgb(64, 64, 64);">：  
</font><font style="color:rgb(64, 64, 64);">拔出其中一个SIM卡，观察IMEI是否消失。如果消失，则说明是双卡设备的正常现象。</font>

---

### **2. 设备被修改或刷机**
+ **<font style="color:rgb(23, 23, 23);">原因</font>**<font style="color:rgb(64, 64, 64);">：  
</font><font style="color:rgb(64, 64, 64);">部分设备（如安卓手机）可能因刷机、Root或更换硬件（如主板）导致系统中存储了多个IMEI。</font>
    - **<font style="color:rgb(23, 23, 23);">双IMEI存储</font>**<font style="color:rgb(64, 64, 64);">：某些设备可能同时存储主IMEI和备用IMEI（用于备用或修复）。</font>
    - **<font style="color:rgb(23, 23, 23);">非法操作</font>**<font style="color:rgb(64, 64, 64);">：刷机时可能误操作导致系统记录了多个IMEI。</font>

