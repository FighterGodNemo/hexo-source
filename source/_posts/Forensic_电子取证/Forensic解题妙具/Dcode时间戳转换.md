---
title: "Dcode时间戳转换"
date: 2026-03-15 13:28:28
categories:
- Forensic_电子取证
- Forensic解题妙具
---

### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">一、基础使用步骤</font>
1. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">启动工具</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">打开 Dcode 应用程序，主界面会显示多种时间戳格式选项（如 Unix 时间戳、Windows 文件时间、OLE 自动化时间等）。</font>
2. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">输入时间戳</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">在输入框中粘贴或手动输入需要转换的时间戳值（支持数字、十六进制等格式）。</font>
3. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">选择格式与时区</font>**
    - **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">格式识别</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">：根据时间戳来源选择对应格式（例如：</font>
        * `<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Unix 时间戳</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">（如</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">1721232000</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">）</font>
        * `<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Windows 文件时间</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">（如 </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">01d98acaa7aa2a55</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">）</font>
        * `<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">OLE 自动化时间</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">（如 </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">25569.5</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">））。</font>
    - **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">时区设置</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">：点击“时区”选项，选择目标时区（如</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Asia/Shanghai</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">），工具会自动将 UTC 时间转换为本地时间。</font>
4. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">执行转换</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">点击 </font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">“Decode”</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> 按钮，工具会立即显示转换结果，包括标准日期时间、星期几及时间戳类型说明。</font>

---

### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">⚙️</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> 二、高级功能应用</font>
1. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">十六进制大端格式转换</font>**
    - <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">针对 Windows 注册表中的</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">hex(b)</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">格式（如</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">hex(b):55,2a,aa,a7,ca,8a,d9,01</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">）：</font>
        * <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">手动删除非数字字符并反转字节顺序，得到</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">01d98acaa7aa2a55</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">；</font>
        * <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">在 Dcode 中选择</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">“Windows 文件时间”</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">格式，输入该值并转换。</font>
2. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">批量处理</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">支持一次性粘贴多行时间戳（每行一个值），工具会逐行解析并输出结果列表。</font>
3. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">时间戳生成</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">输入标准日期时间（如 </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">2025-11-22 08:00:00</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">），选择目标格式（如 Unix 时间戳），可反向生成对应时间戳。</font>

---

### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">🛠️</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> 三、典型场景示例</font>
1. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">Windows 注册表分析</font>**
    - <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">提取</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">RegDiagTrack.txt</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">中的</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">LastSuccessfulUploadTime</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">值（如</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">hex(b):7a,96,6c,2b,cb,8a,d9,01</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">） ；</font>
    - <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">转换为</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">01d98acb2b6c967a</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">后，选择</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">“Windows 文件时间”</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">格式，得到</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">2025-11-22 07:38:17 UTC</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">（即当前时间）。</font>
2. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">安卓取证</font>**
    - <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">从 SQLite 数据库导出的时间戳</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">1284138059052</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">（毫秒级 Unix 时间戳）；</font>
    - <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">在 Dcode 中选择</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">“Unix 时间戳”</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">，输入值后自动转换为</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">2025-11-22 07:38:17 UTC</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">。</font>

---

### <font style="color:#000000;background-color:rgba(255, 255, 255, 0);">💡</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);"> 四、注意事项</font>
1. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">格式匹配</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">若转换结果异常，需检查时间戳格式是否选择正确（例如将十六进制误选为 Unix 时间戳）。</font>
2. **<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">时区影响</font>**<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">  
</font><font style="color:#000000;background-color:rgba(255, 255, 255, 0);">所有时间戳默认按 UTC 解析，需手动设置时区以获得本地时间（如北京时间需选 </font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">UTC+8</font>`<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">）。</font>

