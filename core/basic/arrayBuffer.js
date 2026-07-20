/** 参考:
 * 表示通用的、固定长度的原始二进制数据缓冲区，但不能直接访问（黑盒）
 */
const buffer_1 = new ArrayBuffer(16);
console.log(buffer.byteLength);

const view = new Uint16Array(buffer_1);
