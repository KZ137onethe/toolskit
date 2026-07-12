/**
 * 判断环境
 * @param { 'browser' | 'node'} env
 * @returns null | boolean
 */
function judgeEnv(env) {
  const vMap = new Map([
    ["browser", isBrowser],
    ["node", isNode],
  ]);

  function isBrowser() {
    return (
      typeof window !== "undefined" &&
      typeof document !== "undefined" &&
      window.document === document
    );
  }

  function isNode() {
    return typeof process !== "undefined" && process.versions && process.versions.node;
  }

  return vMap.has(env) ? vMap.get(env)() : null;
}

export { judgeEnv };
