import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { build } from 'esbuild';

const target = new URL('../dist/android/', import.meta.url);
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(new URL('../web/', import.meta.url), target, { recursive: true,
  filter: source => !/\.(gif)$/.test(source) && !/\/(sw\.js|sw-update\.js|pwa-update\.js|bust\.html|server-client\.js|native\.js)$/.test(source) });
await writeFile(new URL('runtime.js', target), 'export const LOCAL_MODE = true;\n');
// Keep the unused import harmless in the native bundle, with no SW registration.
await writeFile(new URL('pwa-update.js', target), 'export function installUpdates() {}\n');
await build({ entryPoints: [new URL('../web/native.js', import.meta.url).pathname],
  outfile: new URL('native.js', target).pathname, bundle: true, format: 'iife', target: 'chrome105' });
let html = await readFile(new URL('index.html', target), 'utf8');
html = html.replace('<head>', `<head>\n  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'" />`)
  .replace('<script type="module" src="/app.js"></script>', '<script src="/native.js"></script>\n  <script type="module" src="/app.js"></script>');
await writeFile(new URL('index.html', target), html);
await cp(new URL('../LICENSE', import.meta.url), new URL('LICENSE.txt', target));
console.log('Android assets bundled (local mode, no server or service worker).');
