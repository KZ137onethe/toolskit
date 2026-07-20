// 自定义日期方法, 参考 day.js，文档：https://day.js.org/zh-CN/

class DateEx extends Date {
  /**
   * @typedef {'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'} UnitType
   */
  /**
   * 创建 DateEx 实例
   * @param  {...any} args 初始化实例传入的初始值，同Date实例一致
   */
  constructor(...args) {
    super(...args);
    this.timestamp = this.valueOf();
  }

  // 操作类
  /**
   * 返回增加一定时间的DateEx对象
   * @param {number} num 增加的单位数字
   * @param {UnitType} unit 增加的单位
   * @returns {DateEx}
   */
  add(num, unit) {
    let nowTimestamp = 0;
    const date = new Date(this.timestamp);
    switch (unit) {
      case "year": {
        nowTimestamp = date.setFullYear(date.getFullYear() + num);
        break;
      }
      case "month": {
        nowTimestamp = date.setMonth(date.getMonth() + num);
        break;
      }
      case "day": {
        nowTimestamp = date.setDate(date.getDate() + num);
        break;
      }
      case "hour": {
        nowTimestamp = date.setHours(date.getHours() + num);
        break;
      }
      case "minute": {
        nowTimestamp = date.setMinutes(date.getMinutes() + num);
        break;
      }
      case "second": {
        nowTimestamp = date.setSeconds(date.getSeconds() + num);
        break;
      }
      default: {
        throw new Error(`不支持的单位: ${unit}`);
      }
    }
    return new DateEx(nowTimestamp);
  }

  /**
   * 返回减去一定时间的Date对象
   * @param {number} num 减少的单位数字
   * @param {UnitType} unit 减少的单位
   * @returns {DateEx}
   */
  subtract(num, unit) {
    return this.add(-num, unit);
  }

  // 显示类
  /**
   * 根据传入的占位符返回格式化后的日期
   * @param {string | undefined} formatStr 格式化字符串，不填则使用默认的
   * @returns {string} 格式化后的日期
   */
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

  // 是否是闰年
  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // 比较类
  /**
   * DateEx 对象是否在另一个提供的日期时间之前。
   * @param {Date | DateEx} date 比较对象
   * @param {UnitType} unit 比较单位
   */
  isBefore(date, unit = undefined) {
    // 直接比较Date对象的时间戳
    if (unit === undefined) {
      return this.timestamp < date.valueOf();
    }
    // 两边都推到起始点开始比较
    return new DateEx(date.valueOf()).startOf(unit) > this.startOf(unit);
  }

  /**
   * DateEx 对象是否在另一个提供的日期时间之后。
   * @param { Date | DateEx } date 比较对象
   * @param {UnitType} unit 比较单位
   */
  isAfter(date, unit = undefined) {
    // 直接比较Date对象的时间戳
    if (unit === undefined) {
      return this.timestamp > date.valueOf();
    }
    // 两边都推到起始点开始比较
    return new DateEx(date.valueOf()).startOf(unit) < this.startOf(unit);
  }

  /**
   * 时间是否相同
   * @param { Date | DateEx } date 比较对象
   * @param {UnitType} unit 比较单位
   */
  isSame(date, unit = undefined) {
    // 直接比较Date对象的时间戳
    if (unit === undefined) {
      return this.timestamp === date.valueOf();
    }
    // 两边的起始点是否相同
    return new DateEx(date.valueOf()).startOf(unit) === this.startOf(unit);
  }

  /**
   * 获取某个起始单位的时间戳
   * @param {UnitType} unit
   */
  startOf(unit) {
    const nowDate = new Date(this.timestamp);
    switch (unit) {
      case "year": {
        // 设置为今年年初
        nowDate.setMonth(0, 1);
        nowDate.setHours(0, 0, 0, 0);
        break;
      }
      case "month": {
        // 设置为月初
        nowDate.setDate(1);
        nowDate.setHours(0, 0, 0, 0);
        break;
      }
      case "day": {
        // 设置为当天初始
        nowDate.setHours(0, 0, 0, 0);
        break;
      }
      case "hour": {
        // 设置为这个时辰刚开始
        nowDate.setMinutes(0, 0, 0);
        break;
      }
      case "minute": {
        // 设置为这一分刚开始
        nowDate.setSeconds(0, 0);
        break;
      }
      case "second": {
        nowDate.setMilliseconds(0);
        break;
      }
    }
    return nowDate.valueOf();
  }
}

const d = new DateEx();
console.log(d.format("YYYY-MM-DD HH:mm:ss"));
console.log(d.add(2, "year").subtract(2, "month").format());
console.log(d.format("YYYY-MM-DD HH:mm:ss"));
console.log(d.isBefore(new Date()));
