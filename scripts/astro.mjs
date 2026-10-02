import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

// Cross-platform invocation; do not send CLI telemetry or write global config.
const packageRoot = new URL('../node_modules/astro/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('package.json', packageRoot), 'utf8'));
const entry = fileURLToPath(new URL(manifest.bin.astro, packageRoot));
const result = spawnSync(process.execPath, [entry, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
