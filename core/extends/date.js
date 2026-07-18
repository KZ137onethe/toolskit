// 自定义日期方法, 参考 day.js，文档：https://day.js.org/zh-CN/

class UseDate extends Date {
  constructor(...args) {
    super(...args);
    this.timestamp = this.valueOf();
  }

  // 操作类
  // 返回增加一定时间的Date对象
  add() {}

  // 返回减去一定时间的Date对象
  subtract() {}

  // 显示类
  // 根据传入的占位符返回格式化后的日期
  format(formatStr) {
    if (formatStr === undefined) {
      const opts = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      return new Intl.DateTimeFormat("zh-CN", opts).format(this.timestamp);
    }

    const pad = (num) => String(num).padStart(2, "0");
    const map = new Map([
      ["YYYY", this.getFullYear()],
      ["MM", pad(this.getMonth() + 1)],
      ["DD", pad(this.getDate())],
      ["HH", pad(this.getHours())],
      ["mm", pad(this.getMinutes())],
      ["ss", pad(this.getSeconds())],
    ]);
    const pattern = new RegExp(`${Array.from(map.keys()).join("|")}`, "g");
    return String(formatStr).replace(pattern, function (match, offset) {
      const key = match;
      return map.get(key);
    });
  }

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
console.log(d.format("YYYY-MM-DD HH:mm:ss"));
console.log(d.format());
