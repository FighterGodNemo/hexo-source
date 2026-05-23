---
created: 2026-05-23T10:30
updated: 2026-05-23T10:48
title: ZeroG
permalink: /2026/05/23/Capture_The_Flag_夺旗赛/ZeroG/
categories:
  - Capture_The_Flag_夺旗赛
tags:
  - CTF
  - ZeroG
  - Crypto
  - Reverse
---

## Crypto

### Cry_02.Lunar LCG / 月面伪随机

#### 题目信息

| 项目 | 内容 |
| --- | --- |
| 比赛来源 | ZeroG |
| 题目分类 | Crypto |
| 题目名称 | Cry_02.Lunar LCG / 月面伪随机 |
| 题面 | ZeroG 月面中继站使用一个轻量级伪随机数发生器生成通信密钥流。开发人员说：“我们没有直接使用固定密钥，而是每次用随机数发生器生成密钥流，应该足够安全。” Fen 查看遥测日志后发现，中继站在加密前泄露了几次连续的 PRNG 状态。请分析附件，恢复密钥流并解出 flag。 |
| 附件 | `lunar_lcg.zip` |
| Flag 格式 | `flag{...}` |
| 附件 SHA256 | `3DBE071242C3D47BA22A5891D920CFF48A9F7157C87F36F439B0A8AB256DA0E7` |

#### 解题思路

附件很简洁，只有 `README.txt`、`output.txt` 和 `encrypt.py`。这类题最适合先看实现，再决定是从密文入手还是从状态泄露入手。

读完 `encrypt.py` 后可以确认，题目用的是标准线性同余生成器 LCG。每次先更新内部状态，再取新状态的最低 8 位作为一个字节的密钥流，然后对明文逐字节异或。

题面已经提醒了关键点：连续的 PRNG 状态泄露足够恢复参数。既然 `output.txt` 里直接给出了多个连续 state，那么不需要猜测密文结构，也不需要爆破种子，直接从递推公式反推 `a` 和 `c` 就够了。

#### 技术实施

先看加密核心逻辑：

```python
class LunarLCG:
    def __init__(self, m, a, c, state):
        self.m = m
        self.a = a
        self.c = c
        self.state = state

    def next_state(self):
        self.state = (self.a * self.state + self.c) % self.m
        return self.state

    def next_byte(self):
        return self.next_state() & 0xff
```

`output.txt` 给出了模数 `m`、6 个连续泄露状态，以及最终密文：

```text
m = 170141183460469231731687303715884105727
leak_states = [
    48077378362307815584689819960136019875,
    100310108693164117002347749113390493183,
    145646689101109657050476193569066602802,
    63949818470656288394594660187785964270,
    46314465195318558087862397882705709486,
    103138436636073932218183299598776830813,
]
ciphertext = 39fe07de62fdc9bf74bbbcbd7e202386ca9e40451b46c74968e30fff138a95
```

LCG 满足：

```text
state[i + 1] = a * state[i] + c mod m
```

用前三个状态就能直接解出参数。把式子写开：

```text
state1 = a * state0 + c mod m
state2 = a * state1 + c mod m
```

两式相减可得：

```text
state2 - state1 = a * (state1 - state0) mod m
```

所以：

```text
a = (state2 - state1) * (state1 - state0)^(-1) mod m
c = state1 - a * state0 mod m
```

代入之后得到：

```text
a = 47706504925832043350690201375217556277
c = 106332766362414553063251587032479728762
```

接着把这组参数代回去检查所有泄露状态，6 个状态之间的递推全部成立，说明参数恢复无误。

由于题目说泄露发生在加密前，而且 `next_byte()` 每次都会先 `next_state()`，所以恢复密钥流时应该从最后一个泄露状态继续往前推，生成与密文等长的字节流，再逐字节异或。

最终解密结果直接落成标准 flag：

```text
flag{ZeroG_lcg_stream_recovery}
```

#### 关键命令

```powershell
D:\CaptureTheFlag\CTFTool\7-Zip\7z.exe x -y lunar_lcg.zip -oevidence
python .\scripts\solve.py
```

#### 完整关键代码

```python
from ast import literal_eval
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "evidence" / "output.txt"


def parse_output(path: Path) -> tuple[int, list[int], bytes]:
    text = path.read_text(encoding="utf-8")

    m_line = next(line for line in text.splitlines() if line.startswith("m = "))
    m = int(m_line.split("=", 1)[1].strip())

    states_block = text.split("leak_states =", 1)[1].split("ciphertext =", 1)[0].strip()
    states = list(literal_eval(states_block))

    ct_line = next(line for line in text.splitlines() if line.startswith("ciphertext = "))
    ciphertext = bytes.fromhex(ct_line.split("=", 1)[1].strip())

    return m, states, ciphertext


def recover_lcg_params(m: int, states: list[int]) -> tuple[int, int]:
    if len(states) < 3:
        raise ValueError("need at least 3 consecutive states")

    s0, s1, s2 = states[:3]
    numerator = (s2 - s1) % m
    denominator = (s1 - s0) % m
    a = (numerator * pow(denominator, -1, m)) % m
    c = (s1 - a * s0) % m
    return a, c


def keystream_from_state(m: int, a: int, c: int, state: int, length: int) -> bytes:
    out = bytearray()
    for _ in range(length):
        state = (a * state + c) % m
        out.append(state & 0xFF)
    return bytes(out)


def main() -> None:
    m, states, ciphertext = parse_output(OUTPUT)
    a, c = recover_lcg_params(m, states)

    for i in range(len(states) - 1):
        assert (a * states[i] + c) % m == states[i + 1]

    ks = keystream_from_state(m, a, c, states[-1], len(ciphertext))
    plaintext = bytes(x ^ y for x, y in zip(ciphertext, ks))
    flag = plaintext.decode("ascii")

    assert flag.startswith("flag{") and flag.endswith("}")

    print(f"a = {a}")
    print(f"c = {c}")
    print(f"flag = {flag}")


if __name__ == "__main__":
    main()
```

#### 验证输出

运行脚本后得到：

```text
a = 47706504925832043350690201375217556277
c = 106332766362414553063251587032479728762
flag = flag{ZeroG_lcg_stream_recovery}
```

其中脚本还会逐项断言所有泄露状态都满足同一组 LCG 参数，因此不是只撞对了一个明文前缀，而是完整复原了生成器。

#### 知识点总结

这题的关键不是“LCG 不安全”这句结论本身，而是要看到连续状态泄露已经把问题从伪随机分析降成了模逆运算。只要 `m` 已知，并且 `state1 - state0` 在模 `m` 下可逆，就能从三个连续状态直接恢复 `a` 和 `c`。

遇到这类题时，优先确认泄露的是内部 state、输出值还是截断值。如果拿到的是完整连续 state，通常应该先走参数恢复，再谈 keystream 和解密，效率会高很多。

#### 最终 flag

```text
flag{ZeroG_lcg_stream_recovery}
```

## Reverse

### Re_03.Nebula Patch / 星云补丁

#### 题目信息

| 项目 | 内容 |
| --- | --- |
| 比赛来源 | ZeroG |
| 题目分类 | Reverse |
| 题目名称 | Re_03.Nebula Patch / 星云补丁 |
| 题面 | ZeroG 深空探测器的星云模块内置了一段许可证校验逻辑。工程师为了阻止逆向分析，加入了反调试检测和多层逻辑判断。Fen 留下了一句话：“如果星云不让你观察它，那就改变观测路径。”请逆向分析程序，绕过阻碍，恢复正确输入并得到 flag。 |
| 附件 | `nebula_patch.zip` |
| Flag 格式 | `flag{...}` |
| 附件 SHA256 | `0669C03109929EDC4DDFF0DDC7E05DC030EC7606DCD3AB5D8AD6D5889C3B6501` |

#### 解题思路

附件解压后只有一个 stripped 的 ELF 可执行文件和简短说明。题面已经明确说程序会做反调试，而且 Fen 给出的提示是“改变观测路径”，因此这题最自然的方向不是硬挂调试器，而是先把输入校验和 flag 生成逻辑静态拆开。

先用 `file`、`strings`、`readelf`、`objdump` 做基础摸底，可以确认样本是 `ELF 64-bit LSB pie executable, x86-64, stripped, dynamically linked`。字符串里能直接看到几条关键提示，例如 `Nebula distortion detected.`、`Nebula gate collapsed.`、`Access granted.`，说明程序至少有反调试分支、失败分支和成功分支。

继续顺着主函数往下梳理后，可以发现前面的确有两层反调试检测，但真正决定输入是否正确的逻辑并不复杂，而且其中还混入了一条故意吓人的死分支。把这些噪声去掉后，整个题目就变成了两步：先逆出正确口令，再用口令派生种子去解密内置 flag。

#### 技术实施

程序入口附近先调用 `ptrace(PTRACE_TRACEME, ...)`，随后还会读取 `/proc/self/status`，查找 `TracerPid:` 是否为 0。只要探测到调试器，就会输出：

```text
[!] Nebula distortion detected.
```

除此之外，在 `0x126a` 一带还有一个看起来像关键校验的逻辑块。这个块最终会把某个计算结果的低字节拿去和 `0x42` 比较。把该块单独拎出来计算后，可以确认低字节固定是 `0xD4`，因此跳去：

```text
[!] Nebula gate collapsed.
```

的路径在正常程序流里根本不可达，这一段只是干扰分析视线的障眼法。

真正的输入处理使用 `fgets` 读取字符串，并去掉行尾换行。随后会检查长度是否等于 `0x12`，也就是 18 个字符，不满足就直接输出：

```text
[-] Input error.
```

校验目标字节位于 `.rodata` 的 `0x2110`，内容为：

```text
04 8e b3 88 fa 73 d9 1f 81 04 8b 0c aa 3a 56 a1 37 85
```

循环初始寄存器状态可以整理成下面三个值：

```text
acc = 0x6d
r9  = 0x67
r10 = 0x17
```

每一轮都会对输入字节做异或、循环左移和累加，然后把结果并入 `acc`，最后与目标字节比较：

```python
tmp = rol8(input[i] ^ (r9 & 0xff), (i % 6) + 1)
tmp = (tmp + (r10 & 0xff)) & 0xff
acc ^= tmp
assert acc == target[i]
r9 += 0x0b
r10 += 0x17
```

由于每轮都会把当前 `acc` 与目标数组直接比较，所以并不需要爆破输入，而是可以逐字节反推：

```python
z = acc ^ target[i]
y = (z - (r10 & 0xff)) & 0xff
input[i] = ror8(y, (i % 6) + 1) ^ (r9 & 0xff)
```

按这个逆过程恢复出来的 18 字节口令为：

```text
Nebula-7F3A-Vector
```

口令正确后，程序会进入成功分支，先输出：

```text
[+] Access granted.
[+] Flag:
```

接着用口令生成一个 32 位种子。对应逻辑可以还原为：

```python
esi = 0x9E3779B9
edi = 0x4E42554C

for i, b in enumerate(passcode_bytes):
    eax = (b << ((i & 3) * 8)) & 0xffffffff
    eax ^= edi
    eax = (eax + esi) & 0xffffffff
    esi = (esi + 0x045D9F3B) & 0xffffffff
    eax = rol32(eax, 5)
    edi = eax ^ 0x7F4A7C15

seed = eax ^ 0xBF4BAC18
```

把刚恢复出的口令代入后，得到的种子是：

```text
0x8887cf28
```

真正的 flag 密文位于 `.rodata` 的 `0x20e0`，长度为 `0x22` 字节：

```text
9d270153e1de3787561d569097d80ab42ed5a79b67e355a915f33bcfe93e6d5707af
```

程序会以这个种子为初始状态，每 4 字节调用一次 `xorshift32`，再和递增的单字节掩码一起异或生成明文：

```python
def xorshift32(x):
    x ^= (x << 13) & 0xffffffff
    x ^= (x >> 17) & 0xffffffff
    x ^= (x << 5) & 0xffffffff
    return x & 0xffffffff


eax = seed
edi = 0x42

for i, enc in enumerate(flag_data):
    if (i & 3) == 0:
        eax = xorshift32(eax)
    out[i] = enc ^ (edi & 0xff) ^ ((eax >> ((i & 3) * 8)) & 0xff)
    edi += 0x0d
```

最终可以完整解出静态 flag。

#### 关键命令

```powershell
D:\CaptureTheFlag\CTFTool\7-Zip\7z.exe x -y nebula_patch.zip -oevidence
python .\scripts\solve.py
```

#### 完整关键代码

```python
from pathlib import Path


PASS_TARGET = bytes.fromhex("048eb388fa73d91f81048b0caa3a56a13785")
FLAG_DATA = bytes.fromhex(
    "9d270153e1de3787561d569097d80ab42ed5a79b67e355a915f33bcfe93e6d5707af"
)


def rol8(value: int, count: int) -> int:
    value &= 0xFF
    count &= 7
    return ((value << count) | (value >> (8 - count))) & 0xFF


def ror8(value: int, count: int) -> int:
    value &= 0xFF
    count &= 7
    return ((value >> count) | (value << (8 - count))) & 0xFF


def rol32(value: int, count: int) -> int:
    value &= 0xFFFFFFFF
    count &= 31
    return ((value << count) | (value >> (32 - count))) & 0xFFFFFFFF


def recover_passcode() -> str:
    acc = 0x6D
    r9 = 0x67
    r10 = 0x17
    recovered = []

    for index, target in enumerate(PASS_TARGET):
        z = acc ^ target
        y = (z - (r10 & 0xFF)) & 0xFF
        plain = ror8(y, (index % 6) + 1) ^ (r9 & 0xFF)
        recovered.append(plain)

        tmp = rol8(plain ^ (r9 & 0xFF), (index % 6) + 1)
        tmp = (tmp + (r10 & 0xFF)) & 0xFF
        acc ^= tmp
        r9 += 0x0B
        r10 += 0x17

    return bytes(recovered).decode("ascii")


def derive_seed(passcode: str) -> int:
    esi = 0x9E3779B9
    edi = 0x4E42554C
    eax = 0

    for index, byte in enumerate(passcode.encode("ascii")):
        eax = ((byte << ((index & 3) * 8)) & 0xFFFFFFFF) ^ edi
        eax = (eax + esi) & 0xFFFFFFFF
        esi = (esi + 0x045D9F3B) & 0xFFFFFFFF
        eax = rol32(eax, 5)
        edi = eax ^ 0x7F4A7C15

    return eax ^ 0xBF4BAC18


def xorshift32(value: int) -> int:
    value ^= (value << 13) & 0xFFFFFFFF
    value ^= (value >> 17) & 0xFFFFFFFF
    value ^= (value << 5) & 0xFFFFFFFF
    return value & 0xFFFFFFFF


def decode_flag(seed: int) -> str:
    eax = seed
    edi = 0x42
    output = bytearray()

    for index, item in enumerate(FLAG_DATA):
        if (index & 3) == 0:
            eax = xorshift32(eax)
        key_byte = (eax >> ((index & 3) * 8)) & 0xFF
        output.append(item ^ (edi & 0xFF) ^ key_byte)
        edi += 0x0D

    return output.decode("ascii")


def main() -> None:
    passcode = recover_passcode()
    seed = derive_seed(passcode)
    flag = decode_flag(seed)

    print(f"binary  = {Path(__file__).resolve().parent.parent / 'evidence' / 'nebula_patch'}")
    print(f"passcode= {passcode}")
    print(f"seed    = 0x{seed:08x}")
    print(f"flag    = {flag}")


if __name__ == "__main__":
    main()
```

#### 验证输出

运行复现脚本后得到：

```text
binary  = C:\Users\glj07\Desktop\Codex工作区\Writeup\CTF\ZeroG\Reverse\Re_03.Nebula Patch\evidence\nebula_patch
passcode= Nebula-7F3A-Vector
seed    = 0x8887cf28
flag    = flag{ZeroG_nebula_patch_antidebug}
```

这一步同时验证了三件事：口令恢复正确、种子推导正确、最终解密结果满足标准 flag 格式，因此整条逆向链路是闭合的。

#### 知识点总结

这题的关键不是和反调试机制正面对抗，而是先判断哪些逻辑真正参与结果生成。`ptrace` 和 `TracerPid` 检查确实存在，但并不影响静态还原数据流；那个通往 `Nebula gate collapsed` 的比较分支更是纯粹的烟雾弹。把这些噪声剥掉以后，题目核心只剩一个可逆的逐字节校验器和一个简单的 `xorshift32` 解码器。

遇到类似题型时，优先判断输入是否逐轮与常量比较。如果每轮状态都被立刻校验，往往意味着可以直接从比较值反推出明文输入，而不必陷入爆破或者动态 patch 的思路里。题面里的“改变观测路径”，本质上正是在提醒这件事。

#### 最终 flag

```text
flag{ZeroG_nebula_patch_antidebug}
```
