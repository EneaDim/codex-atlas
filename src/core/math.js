const MATHJAX_TIMEOUT_MS = 6000;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getMathJax() {
  const started = Date.now();
  while (Date.now() - started < MATHJAX_TIMEOUT_MS) {
    const mj = window.MathJax;
    if (mj?.startup?.promise && mj?.typesetPromise) {
      try {
        await mj.startup.promise;
        return mj;
      } catch {
        return null;
      }
    }
    await wait(40);
  }
  return null;
}

export async function typesetMath(root) {
  if (!root) return;
  const mj = await getMathJax();
  if (!mj) {
    root.classList?.add('math-fallback');
    return;
  }
  try {
    mj.typesetClear?.([root]);
    await mj.typesetPromise([root]);
    root.classList?.remove('math-fallback');
  } catch {
    root.classList?.add('math-fallback');
  }
}
