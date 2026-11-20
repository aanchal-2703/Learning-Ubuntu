import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function readLocalEnv() {
  try {
    return Object.fromEntries(readFileSync(resolve(process.cwd(), 'local.env'), 'utf8')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#') && line.includes('='))
      .map(line => {
        const splitAt = line.indexOf('=');
        return [line.slice(0, splitAt).trim(), line.slice(splitAt + 1).trim().replace(/^['"]|['"]$/g, '')];
      }));
  } catch {
    return {};
  }
}

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || readLocalEnv().VITE_API_URL || ''),
  },
});
