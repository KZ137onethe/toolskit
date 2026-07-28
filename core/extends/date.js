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

  /**
   * 返回指定单位下两个日期时间之间的差异。
   * @param {string | Date | DateEx } date 比较日期
   * @param {UnitType} unit 比较的时间单位
   * @param {boolean} decimal 是否包含小数
   * @returns {number}
   */
  diff(date, unit, decimal = false) {
    let val;
    let diff,
      maxDate,
      minDate,
      timestamp = 0;
    // 如果是字符串，默认直接使用Date对象实例化（底层会调用Date.parse做解析）
    if (typeof date === "string") {
      if (Date.parse(date) === NaN) throw new Error("Invalid time format");
      timestamp = new Date(date).valueOf();
    } else if (date instanceof Date) {
      timestamp = date.valueOf();
    }
    // 如果是 Date 对象或者 DateEx 对象
    else {
      throw new Error(`Invalid pass parameter: "${date}"`);
    }
    const obj = {
      second: 1000,
      get minute() {
        return this.second * 60;
      },
      get hour() {
        return this.minute * 60;
      },
      get day() {
        return this.hour * 24;
      },
    };
    diff = this.timestamp - timestamp;
    maxDate = new DateEx(Math.max(this.timestamp, timestamp));
    minDate = new DateEx(Math.min(this.timestamp, timestamp));
    if (unit === "year") {
      // ? 比较年的时候，是比较月份的1/12数值
      val = Number(Number(this.diff(date, "month", true) / 12).toFixed(15));
    } else if (unit === "month") {
      // ! 因为每个月天数不一样,不能用时间戳来计算
      // 差异 = 月份差 + (较大的时间的时间戳 - 虚拟对齐时间戳) / (下一个月对齐点 - 虚拟对齐时间戳)
      const _date = new Date(timestamp);
      const diffYear = this.getFullYear() - _date.getFullYear();
      // 整数部分
      const diffMoth = diffYear * 12 + (this.getMonth() - _date.getMonth());
      // 小数部分 = (较大的时间的时间戳 - 虚拟对齐时间戳) / (下一个月对齐点 - 虚拟对齐时间戳)
      const decimalPart = Number(
        (maxDate.valueOf() - minDate.add(diffMoth, "month").valueOf()) /
          (minDate.add(diffMoth + 1, "month").valueOf() - minDate.add(diffMoth, "month").valueOf()),
      ).toFixed(15);
      val = diffMoth + Number(decimalPart);
    } else {
      // 默认保留15位小数
      val = Number(diff / obj[unit]).toFixed(15);
    }

    // 没有指定单位,直接返回时间戳
    if (unit === undefined) return diff;
    // decimal为false时,不保留小数部分
    if (decimal === false) return Math.trunc(val);
    // 直接返回小数部分
    return val;
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
    const timestamp = date.valueOf();
    // 直接比较Date对象的时间戳
    if (unit === undefined) {
      return this.timestamp < timestamp;
    }
    // 两边都推到起始点开始比较
    return new DateEx(timestamp).startOf(unit) > this.startOf(unit); // ? 比较时会各自调用其 valueOf() 方法
  }

  /**
   * DateEx 对象是否在另一个提供的日期时间之后。
   * @param { Date | DateEx } date 比较对象
   * @param {UnitType} unit 比较单位
   */
  isAfter(date, unit = undefined) {
    const timestamp = date.valueOf();
    // 直接比较Date对象的时间戳
    if (unit === undefined) {
      return this.timestamp > timestamp;
    }
    // 两边都推到起始点开始比较
    return new DateEx(timestamp).startOf(unit) < this.startOf(unit); // ? 比较时会各自调用其 valueOf() 方法
  }

  /**
   * 时间是否相同
   * @param { Date | DateEx } date 比较对象
   * @param {UnitType} unit 比较单位
   */
  isSame(date, unit = undefined) {
    const timestamp = date.valueOf();
    // 直接比较Date对象的时间戳
    if (unit === undefined) {
      return this.timestamp === timestamp;
    }
    // 两边的起始点是否相同
    return new DateEx(timestamp).startOf(unit) == this.startOf(unit); // ? 比较时会各自调用其 valueOf() 方法
  }

  /**
   * 获取该DateEx对象某个单位的起始DateEx对象
   * @param {UnitType} unit
   * @returns {DateEx}
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
    return new DateEx(nowDate.valueOf());
  }

  /**
   * 获取该DateEx对象某个单位的末尾DateEx对象
   * @param {UnitType} unit
   * @returns {DateEx}
   */
  endOf(unit) {
    const nextStart = this.add(1, unit).startOf(unit);
    const endTimestamp = nextStart.valueOf() - 1;
    return new DateEx(endTimestamp);
  }

  /**
   * 复制出一个当前对象
   * @returns { DateEx }
   */
  clone() {
    return new DateEx(this.timestamp);
  }

  /**
   * 表示 DateEx 的日期是否通过校验
   * @returns {boolean}
   */
  isValid() {
    return this.timestamp === NaN ? false : true;
  }

  /**
   * 返回当前日期所在月份的天数
   * @returns { number }
   */
  daysInMonth() {
    // 获取一个下月月初的虚拟日期
    let virtualDate = new DateEx(this.timestamp).add(1, "month");
    virtualDate.setDate(1);
    virtualDate.setHours(0, 0, 0, 0);
    return new Date(virtualDate.valueOf() - 1).getDate();
  }

  /**
   * 插件扩展方法
   * @param {Function} plugin 插件函数
   * @param {any} opt 额外参数
   * @returns { typeof DateEx }
   */
  static extend(plugin, opt) {
    if (!plugin.$i) {
      plugin(opt, DateEx);
      plugin.$i = true;
    }
    return DateEx;
  }
}

// 自定义 extend 支持扩展插件, 文档参考：https://day.js.org/docs/zh-CN/plugin/plugin
function extend() {
  // minmax 插件
  const minmax = (opt, d) => {
    const sortBy = (dates, method) => {
      // 保证 dates 是一个数组或者是一个只有一个数组元素的数组，且要求所有的子元素是一个 Date
      if (
        !(dates instanceof Array) ||
        (dates instanceof Array && !dates.every((date) => date instanceof Date)) ||
        (dates[0] instanceof Array && !dates[0].every((date) => date instanceof Date))
      ) {
        return null;
      }

      if (dates[0] instanceof Array) {
        dates = dates.flat();
      }
      // 将所有元素都转化为 DateEx
      const $dates = dates.map((date) => new d(date.valueOf()));

      let result = $dates[0];
      let idx = 0;
      for (let [i, date] of $dates.slice(1).entries()) {
        if (date[method](result)) {
          result = date;
          idx = i + 1;
        }
      }
      return dates[idx];
    };

    /** min 接受传入多个DateEx实例或者Date实例或一个数组, 返回最小的
     *
     * @returns { DateEx | Date }
     */
    d.prototype.min = function () {
      const args = Array.prototype.slice.call(arguments, 0);
      return sortBy(args, "isBefore");
    };
    // max 接受传入多个DateEx实例或者Date实例或一个数组, 返回最大的
    d.prototype.max = function () {
      const args = Array.prototype.slice.call(arguments, 0);
      return sortBy(args, "isAfter");
    };
  };

  // TODO：toObject 插件
  // 		toObject 返回包含时间信息的 Object
  const toObject = () => {};

  return {
    minmax,
    toObject,
  };
}

export default DateEx;
export { extend };

const { minmax } = extend();
DateEx.extend(minmax);
const d = new DateEx();
console.log(d.format("YYYY-MM-DD HH:mm:ss"));
console.log(d.add(2, "year").subtract(2, "month").format());
console.log(d.format("YYYY-MM-DD HH:mm:ss"));
console.log(d.endOf("year").format());
console.log(d.diff("2025-06-25 15:23:00", "year", true));
console.log(d.daysInMonth());
console.log(d.max(new DateEx("2023-06-25"), new Date("2025-10-21")));

// 解析 字符串
const e = new DateEx("2018-04-04T16:00:00.000Z");
console.log(e.format());
