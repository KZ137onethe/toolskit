const obj = Object.freeze({
  a: 1,
  b: 2,
  gbkData: new Uint8Array([
    0xc8, 0xcb, 0xc3, 0xf1, 0xb1, 0xd8, 0xd0, 0xeb, 0xd3, 0xa6, 0xd3, 0xc3, 0x20, 0x48, 0x65, 0x6c,
    0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21, 0x20, 0x31, 0x32, 0x33, 0x34, 0x35,
  ]),
  text: "Hello, world",
  url: "https://cn.bing.com/search?form=QBLH&q=字母表",
});

// mark TextEncoder And TextDeCoder
// 只能对字符串进行 utf-8 编码
const encoder = new TextEncoder();
// 默认对字符串进行 utf-8 解码
const decoder = new TextDecoder();

const dataView = encoder.encode(obj.text);
console.log("💬 ⋮ dataView => ", dataView);
const originData1 = decoder.decode(dataView);
console.log("💬 ⋮ originData => ", originData1);

// 对字符串进行 gbk 解码，还支持：https://developer.mozilla.org/zh-CN/docs/Web/API/TextDecoder
const decodeGBK = new TextDecoder("GBK");
const _originData = decodeGBK.decode(obj.gbkData);
console.log("💬 ⋮ _originData => ", _originData);
console.log(
  "utf8解码和gbk解码是否相等？ =>",
  `${decoder.decode(obj.gbkData) === decodeGBK.decode(obj.gbkData)}`,
);

// mark btoa And atob
// 对字符串进行 base64 编码
const base64Data = window.btoa(obj.text);
console.log("💬 ⋮ base64Data => ", base64Data);
// 对字符串进行 base 解码
const originData2 = window.atob(base64Data);
console.log("💬 ⋮ originData2 => ", originData2);

// mark encodeURI And encodeURI
// 特点：不编码完整URL中的特殊字符，主要用于编解码完整的URL
// 对字符串进行 资源统一标识符（URI） 编码
const URIData = window.encodeURI(obj.url);
console.log("💬 ⋮ URIData => ", URIData);
// 对字符串进行 资源统一标识符（URI） 解码
const originData3 = window.decodeURI(URIData);
console.log("💬 ⋮ originData3 => ", originData3);

// mark encodeURIComponent And decodeURIComponent
// 特点：编码所有非字母数字字符，主要用于编码URL参数值
const [, urlParams] = obj.url.split("?");
const _URIData = window.encodeURIComponent(urlParams);
console.log("💬 ⋮ _URIData => ", _URIData);
const originData4 = window.decodeURIComponent(_URIData);
console.log("💬 ⋮ originData4 => ", originData4);