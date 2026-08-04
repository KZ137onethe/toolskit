/**
 * 生成start~end递增的数组，包头不包尾
 * @param {number} start 起始值
 * @param {number} end 终止值
 * @returns {Generator<number>}
 */
function* range(start, end) {
  while (end > start) {
    yield start++;
  }
}

/**
 * 生成一个以start开头, step为步长，长度为len的数字
 * @param {number} start
 * @param {number} len
 * @param {number} step
 * @returns {Generator<number>}
 */
function* generate_array(start, len, step = 1) {
  while (len--) {
    yield start;
    start += step;
  }
}

export { range, generate_array };
