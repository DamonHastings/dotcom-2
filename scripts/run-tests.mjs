#!/usr/bin/env node
// ESM entry to run Vitest programmatically to avoid CommonJS -> ESM require issues on CI.
import { spawnSync } from 'child_process';

try {
  const vitestModule = await import('vitest');

  // Try a few known entry names for the programmatic runner
  const runFn =
    vitestModule.run ??
    vitestModule.runVitest ??
    vitestModule.start ??
    vitestModule.createVitest ??
    vitestModule.default?.run ??
    vitestModule.default?.runVitest;

  if (typeof runFn === 'function') {
    const result = await runFn({ config: 'vitest.config.cjs', run: true });
    const code = typeof result === 'number' ? result : 0;
    process.exit(code);
  }

  // Fallback 1: spawn a short ESM node process that imports and runs Vitest.
  // Using `--input-type=module` ensures the child Node process treats the
  // inline script as ESM and avoids CJS require() of ESM-only modules.
  try {
    const nodeArgs = [
      '--input-type=module',
      '-e',
      "import('vitest').then(m=> (m.run??m.runVitest)?.({ run: true })).catch(e=>{ console.error(e); process.exit(1); })",
    ];
    const child = spawnSync(process.execPath, nodeArgs.concat(process.argv.slice(2)), { stdio: 'inherit' });
    if (child.status !== null) process.exit(child.status);
  } catch (e) {
    // fall through to the next fallback
  }

  // Fallback 2: spawn the CLI via npx/pnpm which usually runs in an ESM-capable
  // process on CI. Try `pnpm dlx` first (faster on pnpm-managed projects),
  // then `npx` if pnpm isn't available.
  const tryExec = (cmd, args) => {
    try {
      const result = spawnSync(cmd, args, { stdio: 'inherit' });
      if (result.status === 0) process.exit(0);
      // if non-zero, return the status to try other fallbacks
      return result.status ?? 1;
    } catch (err) {
      return 1;
    }
  };

  let status = tryExec('pnpm', ['dlx', 'vitest', '--', '--config', 'vitest.config.cjs', '--run']);
  if (status !== 0) {
    status = tryExec('npx', ['vitest', '--config', 'vitest.config.cjs', '--', '--run']);
  }
  process.exit(status ?? 1);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Failed to run vitest via ESM import or fallback CLI', err);
  process.exit(1);
}
