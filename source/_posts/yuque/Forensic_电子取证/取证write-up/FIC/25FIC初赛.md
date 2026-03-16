---
title: "25FIC初赛"
date: 2026-03-15 13:28:26
categories:
- Forensic_电子取证
- 取证write-up
- FIC
---

## <font style="color:#000000;">前言</font>
## <font style="color:#000000;">一、手机取证</font>
### <font style="color:#000000;">1.该手机的device_name是？</font>
<font style="color:#000000;">全局搜索</font>![](1761953083567-de0dfb11-ac8b-4b5f-9301-e6348f5300f6.png)

`<font style="color:#000000;background-color:rgb(245, 245, 245);">检材2.tar/adb/lspd/log/props.txt</font>`<font style="color:#000000;"> 可以看到设备信息：</font>![](1761953194987-d0efa345-214e-435b-8cf3-610d14ef3eb6.png)

<font style="color:rgb(82, 196, 26);">Redmi 6 Pro</font>

### <font style="color:#000000;">2.嫌疑人pc开机密码是什么？</font>
![](1745753924965-abc712fe-882b-48c4-bd03-fd9e5d5c2727.png)<font style="color:rgba(0, 0, 0, 0.87);">一般手机中记录密码的地方: 远控相关软件记录、手机便签、照片等。浏览该软件安装软件列表, 没有远程连接相关软件. 查看便签相关软件, 该设备安装了三个软件:</font>![](1761953557182-80bf474c-d7f2-42d7-9fc6-a7dccabb36f4.png)![](1761953564986-e296448b-0ce6-4f2e-9f03-2859cc026f18.png)![](1761953592147-0d47c9c8-8040-45d1-8718-a9fab8f46936.png)

`<font style="color:rgb(54, 70, 78);background-color:rgb(245, 245, 245);">/data/{packageName}</font>`<font style="color:rgba(0, 0, 0, 0.87);"> 路径下翻找记录, 最终在"备忘录日记"的路径下找到相关内容:</font>

![](1761953861122-a650badc-901b-467e-97b5-166a7202916c.png)自适应所有列![](1761953941195-a897ee6b-49e0-4288-9f78-221dffba4758.png)

<font style="color:rgb(82, 196, 26);">1qaz2wsx</font>

### <font style="color:#000000;">3.嫌疑人接头暗号是什么？</font>
如上图，接头暗号是

{"note":[{"format":"HEADING","text":"接头暗号"},{"format":"IMAGE","text":"ub690t1mq9kelnah.png"},{"format":"CHECKLIST_UNCHECKED","text":"说上述暗号"}

即一张文本命名为ub690t1mq9kelnah.png的图片

![](1761954084223-07cfe5b0-d7e6-46d8-ad73-61a2abb8aff8.png)

<u><font style="color:#000000;">爱能不能够永远单纯没有悲哀</font></u>

### <font style="color:#000000;">4.嫌疑人存放的秘钥环是多少？</font>
全局搜索秘钥环

![](1761954222097-1f45c16b-42d0-4d08-99c3-679503b46384.png)

注意！这里直接看可能不完整。要打开后看，如下：

![](1761954328820-779a6a55-4d79-41d7-86ea-d48b41d33f24.png)

<u>1qaz2wsx3edc</u>

### <font style="color:#000000;">5.嫌疑人一生中最重要的日子是什么时候？</font>
翻一翻图片就出来了（在OCR用不了的情况下）

![](1761959553551-780c2f19-269b-43b2-93f4-f0a805bcf0ad.png)

<u>2026-02-26</u>

### <font style="color:#000000;">6.嫌疑人微信生成的聊天记录数据库文件名称是什么？</font>
<font style="color:rgba(0, 0, 0, 0.87);">随便选择一条聊天记录, 点击"跳转到源文件":</font>

![](1761959299395-d9b27d96-7c46-48c8-b619-ba46c1f8ef3a.png)

<u>EnMicroMsg.db</u>

### <font style="color:#000000;">7.嫌疑人微信账号对应的 UIN 为多少？</font>
<font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(240, 243, 255);">Unique Identification Number，即“唯一标识号码”或“唯一身份识别码”</font>

![](1761960463836-ccea67bb-51ac-4eed-bd6e-d408da4c04c6.png)

<u><font style="color:rgba(0, 0, 0, 0.87);">1864810197</font></u>

### <font style="color:#000000;">8.嫌疑人微信聊天记录数据库的加密秘钥是什么？</font>
知道uin了，用ForensicTool![](1761960653221-b1a6214b-49de-4525-bec7-a664c80e6e86.png)



### <font style="color:#000000;">9.请分析检材二，请分析"手机"检材，并回答，嫌疑人“欠条.rar”的解压密码是多少？</font>
![](1761961956041-716503ad-0e12-491b-b63d-ff92de116efe.png)

<font style="color:#000000;">推断手机号码藏在图片里  
</font>![](1761961880624-fc4ed9d6-f411-4f00-bf35-f501e656e433.png)

<font style="color:rgba(0, 0, 0, 0.87);">在微信的文件存储目录 </font>`<font style="color:rgb(54, 70, 78);background-color:rgb(245, 245, 245);">检材2.tar/data/com.tencent.mm/MicroMsg/f6781d69b1866c72a087d67dd3b05189/image2/8f/bb/</font>`<font style="color:rgba(0, 0, 0, 0.87);"> 中找到 2 张相似的图片:</font>

怀疑是图片拼接题

Stegsolve——Analyse——Image Combiner

![](1745756790995-c3c8a62d-dc57-4b7e-b333-91551164db37.png)

果然可以找到一个二维码

![](1745757098088-f7bd9187-19bc-446a-ae52-1c40b6007771.png)

如图，得到陈某的电话13170010703，也是欠条的密码：3170010703

（也能这样子做）

![](1746090976722-40aea66c-a372-427c-a72f-b70ab2d1c9fc.png)



### <font style="color:#000000;">10.请分析检材二，请分析"手机"检材，并回答，嫌疑人“欠条.rar”解压后，其中VeraCrypt容器的MD5值是多少？</font>
纯送分，第九题解出来就简单了

![](1745757394485-d3a209e2-6b5e-4d03-acc5-9f4330947e26.png)



### <font style="color:#000000;">11.嫌疑人提供的“欠条.rar”解压后，其中"1.png"图上显示的VeraCrypt容器密码是多少？</font>![](1761956454215-a9aacd83-49fc-4689-8d99-1b3137b13ec8.png)
![](1745757638859-61c75d28-0a9a-4005-8106-a5fce4381f19.png)

可以看到屏幕当中有一串字符，应该是相关的密码，其实我觉得挺清楚的，但是也可以对比度加强点啥的

![](1745757835048-432f7f16-241f-4e07-871e-fcb0b3e42e85.jpeg)

![](1745757813792-e65949ff-073a-4444-9f90-36050be4f918.jpeg)

确实会更清楚点

反正是这个<font style="color:rgb(51, 51, 51);">#!@KE2sax@!da0h5hghg34&@</font>

### <font style="color:#000000;">12.请分析检材二，请分析"手机"检材，并回答，嫌疑人李某全名是什么？</font>
<font style="color:rgb(51, 51, 51);">李某全名根据那张在欠条vc里的图片可以直接看到是</font>

![](1745760239791-57dfda34-3b31-42d4-85a5-7cf473cf8df7.png)

所以李某可知为李安弘，陈某为陈浩北（可以解下边的题目）

其实这道题不用解出欠条也能知道（）

![](1745760319690-89a50569-560e-439b-86ad-0d93eef0ce5d.png)

毕竟案件背景里直接写了嫌疑人叫李安弘



### <font style="color:#000000;">13.请分析检材二，请分析"手机"检材，并回答，嫌疑人欠款金额是多少？</font>
![](1745760239791-57dfda34-3b31-42d4-85a5-7cf473cf8df7.png)

如图，8w元（给我蒙对了，爽死我了）

（这次属于我所对标的手机取证到此为止，难度其实不高，主要在于没能发现两张图片可以通过stegstove发现二维码，如果找到这个的话可以多做很多题，可惜了，还有一些简单题没能做出来也蛮不应该的，唉，盘古石杯再接再厉吧）



## 


