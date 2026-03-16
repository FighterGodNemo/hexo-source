---
title: "ida还原proto文件.md"
date: 2026-03-15 13:28:18
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- 上海awdp赛前培训
- 沙盒攻防赛
- Pwn攻防实战课程讲义
---

搜索 （ctrl + i）常数0x28AAEEF9 或者 二进制搜索（ctrl + b）F9 EE AA 28

IDA快速定位proto的Descriptor结构：  
    1、ctrl + i 常数搜索 0x28AAEEF9   
    2、ctrl + b 二进制搜索 F9 EE AA 28  
这是protubuf的结构体签名

```plain
#define PROTOBUF_C__SERVICE_DESCRIPTOR_MAGIC 0x14159bc3 
#define PROTOBUF_C__MESSAGE_DESCRIPTOR_MAGIC 0x28aaeef9 
#define PROTOBUF_C__ENUM_DESCRIPTOR_MAGIC 0x114315af
```



![](Pasted image 20250604105941.png)  
在这上方 就是协议字段描述了，这里直接看不明显，可以shift + F9导入对应结构体：  
[[IDA常用]]   
1、枚举类型 ProtobufCLabel  
2、枚举类型 ProtobufCtype  
3、结构体 ProtobufCFieldDescriptor

```c
enum ProtobufCLabel
{
  PROTOBUF_C_LABEL_REQUIRED = 0x0,      ///< A well-formed message must have exactly one of this field.
  PROTOBUF_C_LABEL_OPTIONAL = 0x1,      ///< A well-formed message can have zero or one of this field (but not
                                        ///< more than one).
  PROTOBUF_C_LABEL_REPEATED = 0x2,      ///< This field can be repeated any number of times (including zero) in a
                                        ///< well-formed message. The order of the repeated values will be
                                        ///< preserved.
  PROTOBUF_C_LABEL_NONE = 0x3,          ///< This field has no label. This is valid only in proto3 and is
                                        ///< equivalent to OPTIONAL but no "has" quantifier will be consulted.
};

enum ProtobufCType
{
  PROTOBUF_C_TYPE_INT32 = 0x0,          ///< int32
  PROTOBUF_C_TYPE_SINT32 = 0x1,         ///< signed int32
  PROTOBUF_C_TYPE_SFIXED32 = 0x2,       ///< signed int32 (4 bytes)
  PROTOBUF_C_TYPE_INT64 = 0x3,          ///< int64
  PROTOBUF_C_TYPE_SINT64 = 0x4,         ///< signed int64
  PROTOBUF_C_TYPE_SFIXED64 = 0x5,       ///< signed int64 (8 bytes)
  PROTOBUF_C_TYPE_UINT32 = 0x6,         ///< unsigned int32
  PROTOBUF_C_TYPE_FIXED32 = 0x7,        ///< unsigned int32 (4 bytes)
  PROTOBUF_C_TYPE_UINT64 = 0x8,         ///< unsigned int64
  PROTOBUF_C_TYPE_FIXED64 = 0x9,        ///< unsigned int64 (8 bytes)
  PROTOBUF_C_TYPE_FLOAT = 0xA,          ///< float
  PROTOBUF_C_TYPE_DOUBLE = 0xB,         ///< double
  PROTOBUF_C_TYPE_BOOL = 0xC,           ///< boolean
  PROTOBUF_C_TYPE_ENUM = 0xD,           ///< enumerated type
  PROTOBUF_C_TYPE_STRING = 0xE,         ///< UTF-8 or ASCII string
  PROTOBUF_C_TYPE_BYTES = 0xF,          ///< arbitrary byte sequence
  PROTOBUF_C_TYPE_MESSAGE = 0x10,       ///< nested message
};

struct ProtobufCFieldDescriptor {
    /** Name of the field as given in the .proto file. */
    const char		*name;
    /** Tag value of the field as given in the .proto file. */
    uint32_t		id;
    /** Whether the field is `REQUIRED`, `OPTIONAL`, or `REPEATED`. */
    ProtobufCLabel		label;
    /** The type of the field. */
    ProtobufCType		type;
    /**
     * The offset in bytes of the message's C structure's quantifier field
     * (the `has_MEMBER` field for optional members or the `n_MEMBER` field
     * for repeated members or the case enum for oneofs).
     */
    unsigned		quantifier_offset;
    /**
     * The offset in bytes into the message's C structure for the member
     * itself.
     */
    unsigned		offset;
    const void		*descriptor; /* for MESSAGE and ENUM types */
    /** The default value for this field, if defined. May be NULL. */
    const void		*default_value;
    uint32_t		flags;
    /** Reserved for future use. */
    unsigned		reserved_flags;
    /** Reserved for future use. */
    void			*reserved2;
    /** Reserved for future use. */
    void			*reserved3;
};
```

然后将字段转为ProtobufCFieldDescriptor结构类型，就可以很直观的看出.proto  
![](Pasted image 20250604134805.png)

以此写出.proto文件，其中可以发现有_NONE标签，所以用proto3

```c
syntax = "proto3";
package pack.base;
message heybro{
    sint32 opt = 1;
    sint32 malloc_size = 2;
    sint32 idx = 3;
    string con = 4;
}
```

注意：这里repeated标签表示允许同一个字段名在一条消息中出现多次  
可以在.proto文件中同样用repeated修饰

```c
syntax = "proto3";
message HeapPayload {
    int32 option = 1;
    repeated int32 chunksize = 2;
    repeated int32 heap_chunks_id = 3;
    bytes heap_content = 4;
}
```

用repeated修饰的参数在后续使用时用.append进行传参  
例如：

```python
heap = heap_pb2.HeapPayload()
    heap.option = 2
    heap.heap_chunks_id.append(idx)
```

然后用protoc编译为.py文件

```plain
protoc --python_out=./ ./ctf.proto
```



还可以protoc编译为c语言，将c语言结构导入ida中便于逆向

```c
protoc-c --c_out=./ ./ctf.proto
# 在ctf.bp-c.h问价可以找到对应结构体
```

会得到ctf.pb-c.c和ctf.pb-c.h两个文件，在.h中可以找到对应结构体  
需要补充

```c
struct ProtobufCBinaryData { // 这个结构体在protobuf-c项目里面有定义
    size_t	len;        /**< Number of bytes in the `data` field. */
    uint8_t	*data;      /**< Data bytes. */
};

struct ProtobufCMessage {    //  简单实现
uint64_t descriptor; // 8字节指针 
uint32_t n_unknown; // 4字节计数 
uint32_t pad1; // 对齐填充（如果需要） 
uint64_t unknown_ptr; // 8字节指针 
};
```

