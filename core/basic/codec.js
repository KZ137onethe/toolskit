import { judgeEnv } from "../business/environment";

/**
 *
 * @param {string | ArrayBuffer} data
 * @param { 'utf-8' | 'base64' | 'url' | '' } format
 */
function codec(data, format) {
  // 如果不是浏览器环境之间返回
  if (!judgeEnv("browser")) return;

	
}
