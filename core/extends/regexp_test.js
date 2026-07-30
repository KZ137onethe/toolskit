import chalk from "chalk";

// 在 JavaScript 中,使用正则表达式的api:
// RegExp: exec test
// String: match matchAll search replace split

/**
 * @class 正则表达式测试
 * 可以指定某个正则表达式(通过索引或者正则表达式)执行
 */
class RegExpTest {
  /**
   * @constructor 初始化构造器
   * @param {Map.<RegExp, string | string[]>} data - 正则表达式数据
   */
  constructor(data) {
    this.data = data;
  }

  /**
   *
   * @param {Map<RegExp, string | string[]>} map
   * @callback cb 执行回调函数
   * @param { RegExp } key - 正则表达式
   * @param { string | string[] } - 测试正则表达式的字符串/字符串数组
   */
  static executeLog(map, cb) {
    for (let [key, val] of map.entries()) {
      console.log(chalk.bold("RegExp expression: "), chalk.blue(key));
      if (Object.prototype.toString.call(val) === "[object Array]") {
        val.forEach((v) => cb(key, v, console.log));
      } else if (Object.prototype.toString.call(val) === "[object String]") {
        cb(key, val, console.log);
      }
    }
  }

  toExec() {
    RegExpTest.executeLog(this.data, (key, val, log) => {
      const str = val,
        reg = key;
      const output = [
        `${chalk.green("  Test string: ")} '${chalk.magenta(str)}' , result: `,
        RegExp.prototype.exec.call(reg, str),
      ];
      log(...output);
    });
  }

  toTest() {
    RegExpTest.executeLog(this.data, (key, val, log) => {
      const str = val,
        reg = key;
      const output = [
        `${chalk.green("  Test string: ")} '${chalk.magenta(str)}' , result: `,
        RegExp.prototype.test.call(reg, str),
      ];
      log(...output);
    });
  }

  toMatch() {
    RegExpTest.executeLog(this.data, (key, val, log) => {
      const str = val,
        reg = key;

      const output = [
        `${chalk.green("  Test string: ")} '${chalk.magenta(str)}' , result: `,
        String.prototype.match.call(str, reg),
      ];

      log(...output);
    });
  }

  toMatchAll(ignoreGlobal = false) {
    const temp = new Map();

    // 去重
    const deduplication = (arr) => [...new Set([...arr])];
    for (let reg of this.data.keys()) {
      let newReg;
      if (ignoreGlobal === false && !reg.global) {
        throw new Error('正则表达式必须带有全局"g"标识');
      }

      if (ignoreGlobal === true && !reg.global) {
        // 将正则表达式的标志加上"g"
        newReg = new RegExp(reg, deduplication(["g", ...reg.flags.split("")]).join(""));
      }

      temp.set(newReg ? newReg : reg, this.data.get(reg));
    }

    RegExpTest.executeLog(temp, (key, val, log) => {
      const str = val,
        reg = key;

      const calcVal = String.prototype.matchAll.call(str, reg);
      const output = [
        `${chalk.green("  Test string: ")} '${chalk.magenta(str)}' , result: `,
        ...Array.from(calcVal).map((item, idx) => {
          return `\n\t第${idx + 1}项匹配 => ${item}`;
        }),
      ];
      log(...output);
    });
  }

  toSearch() {
    RegExpTest.executeLog(this.data, (reg, str, log) => {
      const output = [
        `${chalk.green("  Test string: ")} '${chalk.magenta(str)}' , result: `,
        String.prototype.search.call(str, reg),
      ];

      // log(...output);
    });
  }

  /**
   * @param {Array.<number> | number | undefined} limit - 分割字符串数组的长度限制
   */
  toSplit(limit = undefined) {
    function fn(reg, str, log, idx) {
      const output = [
        `${chalk.green("  Test string: ")} '${chalk.magenta(str)}' , result: `,
        String.prototype.split.call(str, reg, idx),
      ];

      log(...output);
    }

    // 记录遍历不同正则表达式的次数
    let records = 0;

    const recordProxy = new Proxy(fn, {
      apply(target, $this, args) {
        const reg = args[0];
        const info = args[3];

        if (info) {
          const { size, limit } = info;
          // 拿到实际的前四个参数
          const params = [...args.slice(0, -1), limit];
          if (typeof limit === "number") {
            return target(...params);
          } else if (Array.isArray(limit)) {
            if (limit.length !== size) {
              // 存储 warn 信息
              if (!Object.prototype.hasOwnProperty.call(target, "prompt")) {
                target.prompt = ["toSplit传递的参数长度与测试的Map对象长度不一致"];
              }
            }
            // 记录当前执行的正则表达式
            if (!Object.prototype.hasOwnProperty.call(target, "reg")) {
              target.reg = reg;
            }
            // 如果当前执行的正则表达式和传递的正则表达式不同，记录数+1
            else if (!Object.is(target.reg, reg)) {
              records++;
              target.reg = reg;
            }
            // 获取分割的长度的限制
            const index = limit[records];
            // 替换掉 第四个参数为调用函数的次数
            return target(...params.slice(0, -1), index);
          }
        } else {
          return target(...args);
        }
      },
    });

    try {
      RegExpTest.executeLog(this.data, (reg, str, log) => {
        if (limit !== undefined) {
          return recordProxy(reg, str, log, { size: this.data.size, limit });
        }
        return recordProxy(reg, str, log);
      });
    } finally {
      // 打印警告信息
      if (Object.prototype.hasOwnProperty.call(fn, "prompt")) {
        fn.prompt.forEach((info) => {
          console.log(chalk.bgYellow.bold.dim(`\u26A0 ${info}`));
        });
      }
    }
  }
}

export { RegExpTest };
