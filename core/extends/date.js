// 自定义日期方法, 参考 day.js，文档：https://day.js.org/zh-CN/

class UseDate extends Date {
  constructor(...args) {
    super(...args);
  }

  // 操作类
  // 返回增加一定时间的Date对象
  add() {}

  // 返回减去一定时间的Date对象
  subtract() {}

  // 显示类
  // 根据传入的占位符返回格式化后的日期
  format() {}

  // 比较类
  // 时间是否相同
  isSame() {}

  /**
   * 对时间进行比较
   * @param {Date} date 时间
   * @param {*} options
   * @property {'before' | 'after'} options.way
   * @property {}
   */
  compare(date, options = { way, unit }) {}
}

const d = new UseDate();
console.log(d.valueOf());
