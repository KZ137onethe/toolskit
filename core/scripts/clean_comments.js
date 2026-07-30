import fs from "node:fs/promises";
import path from "node:path";

const current_dir = path.resolve(import.meta.dirname);

// /**
//  * 核心算法：通过状态机安全地移除 // 注释，保留字符串和正则中的 //
//  * @param {string} code 原始代码字符串
//  * @returns {string} 清理后的代码
//  */
// function removeSingleLineComments(code) {
//   let i = 0;
//   let result = "";

//   // 状态标记
//   let inSingleQuote = false; // 是否在 '...' 中
//   let inDoubleQuote = false; // 是否在 "..." 中
//   let inTemplateLiteral = false; // 是否在 `...` 中
//   let inRegex = false; // 是否在 /.../ 正则中
//   let inBlockComment = false; // 是否在 /*...*/ 多行注释中

//   while (i < code.length) {
//     const char = code[i];
//     const nextChar = code[i + 1];

//     // --- 1. 处理转义字符 ---
//     // 如果遇到反斜杠 \，在字符串或正则中它会转义下一个字符，直接跳过下一个字符，防止误判闭合括号
//     if (char === "\\" && (inSingleQuote || inDoubleQuote || inTemplateLiteral || inRegex)) {
//       result += code.substring(i, i + 2);
//       i += 2;
//       continue;
//     }

//     // --- 2. 处理多行注释 /* ... */ ---
//     if (inBlockComment) {
//       result += char; // 保留多行注释（如果只想删单行的话）
//       if (char === "*" && nextChar === "/") {
//         result += nextChar;
//         inBlockComment = false;
//         i += 2;
//         continue;
//       }
//       i++;
//       continue;
//     }

//     // --- 3. 处理字符串和正则状态切换 ---
//     if (!inSingleQuote && !inDoubleQuote && !inTemplateLiteral && !inRegex) {
//       // 进入多行注释
//       if (char === "/" && nextChar === "*") {
//         inBlockComment = true;
//         result += code.substring(i, i + 2);
//         i += 2;
//         continue;
//       }
//       // 💥 核心：识别并抹除单行注释 //
//       if (char === "/" && nextChar === "/") {
//         // 往下寻找换行符，中间的所有内容（即注释）全部忽略跳过
//         i += 2;
//         while (i < code.length && code[i] !== "\n" && code[i] !== "\r") {
//           i++;
//         }
//         // 注意：不把 // 及后面的内容写入 result，相当于删除了它们
//         continue;
//       }
//       // 进入各类字符串或正则
//       if (char === "'") inSingleQuote = true;
//       else if (char === '"') inDoubleQuote = true;
//       else if (char === "`") inTemplateLiteral = true;
//       else if (char === "/") {
//         // 判断 / 是正则还是除法运算符通常很复杂
//         // 这里的简化策略能应付绝大多数场景：如果前一个有效字符是等号、括号、逗号、冒号等，大概率是正则开始
//         const prevTrimmed = result.trim();
//         const lastChar = prevTrimmed[prevTrimmed.length - 1];
//         if (!lastChar || "=([,;:!&|?~".includes(lastChar)) {
//           inRegex = true;
//         }
//       }
//     } else {
//       // 退出状态判断
//       if (inSingleQuote && char === "'") inSingleQuote = false;
//       else if (inDoubleQuote && char === '"') inDoubleQuote = false;
//       else if (inTemplateLiteral && char === "`") inTemplateLiteral = false;
//       else if (inRegex && char === "/") inRegex = false;
//     }

//     result += char;
//     i++;
//   }

//   return result;
// }

function remove_comments() {}

async function check_file_exists(filePath) {
  try {
    // fs.constants.F_OK 代表只检查文件是否存在
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function safe_write_file(targetPath, data) {
  const dirPath = path.dirname(targetPath);
  await fs.mkdir(dirPath, { recursive: true });
  const content = await fs.writeFile(targetPath, data, "utf-8");
  return content;
}

async function main() {
  // 获取命令行参数：node clean-comments.js <输入文件路径> [输出文件路径]
  const args = process.argv.slice(2);
  if (args.length === 0) {
    throw new Error("exit", { cause: { reason: "CLI 缺少参数" } });
    process.exit(1);
  }

  const input_path = path.resolve(args[0]);
  const output_path = args[1] ? path.resolve(current_dir, args[1]) : input_path; // 如果没提供输出路径，默认覆盖原文件

  const exist_file = await check_file_exists(input_path);
  if (!exist_file) {
    throw new Error("exit", { cause: { reason: "输入文件不存在" } });
    process.exit(1);
  }

  const input_file_handler = await fs.open(input_path, "r+");
  const read_stream = input_file_handler.createReadStream({
    encoding: "utf-8",
    highWaterMark: 1024 * 1024, // 1024KB => 1M
  });

  let res_arr = [];
  for await (const chunk of read_stream) {
    res_arr.push(remove_comments(chunk));
  }
  const content = res_arr.join("");
  input_file_handler.close();

  await safe_write_file(output_path, content);
}

async () => {
  await main();
};
