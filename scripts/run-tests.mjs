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

  // Fallback: spawn the CLI via npx which runs in ESM-capable node context
  // This is more robust for CI where programmatic API surface may differ.
  const cmd = 'npx';
  const args = ['vitest', '--config', 'vitest.config.cjs', '--', '--run'];
  const child = spawnSync(cmd, args, { stdio: 'inherit' });
  process.exit(child.status ?? 1);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Failed to run vitest via ESM import or fallback CLI', err);
  process.exit(1);
}
