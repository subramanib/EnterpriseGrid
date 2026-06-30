import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const entryPoint = path.resolve(PACKAGE_ROOT, 'src/index.ts');
const outDir = path.resolve(PACKAGE_ROOT, 'dist');

const shared = {
  entryPoints: [entryPoint],
  bundle: true,
  minify: false,
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    'motion',
    'motion/react',
    'lucide-react',
    'leaflet',
    'react-leaflet',
    'react-big-calendar',
    'date-fns',
    'date-fns/locale/en-US'
  ],
  loader: {
    '.css': 'css',
  },
};

async function main() {
  console.log('=== EnterpriseGrid esbuild Compiler ===');
  
  // Clean dist directory
  if (fs.existsSync(outDir)) {
    console.log('Cleaning old build artifacts...');
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  try {
    // 1. Build ESM (.mjs)
    console.log('Compiling ESM format (dist/enterprisegrid.mjs)...');
    await esbuild.build({
      ...shared,
      format: 'esm',
      outfile: path.join(outDir, 'enterprisegrid.mjs'),
    });

    // 2. Build CJS (.cjs)
    console.log('Compiling CommonJS format (dist/enterprisegrid.cjs)...');
    await esbuild.build({
      ...shared,
      format: 'cjs',
      platform: 'node',
      outfile: path.join(outDir, 'enterprisegrid.cjs'),
    });

    // 3. Build CSS (dist/enterprisegrid.css)
    console.log('Compiling CSS styles (dist/enterprisegrid.css)...');
    await esbuild.build({
      entryPoints: [path.resolve(PACKAGE_ROOT, 'src/style.css')],
      bundle: true,
      outfile: path.join(outDir, 'enterprisegrid.css'),
      loader: {
        '.png': 'dataurl',
        '.gif': 'dataurl',
        '.svg': 'dataurl',
        '.css': 'css',
      },
    });

    // 4. Generate TypeScript typings
    console.log('Generating declaration files (dist/**/*.d.ts)...');
    execSync('npx tsc --emitDeclarationOnly', { cwd: PACKAGE_ROOT, stdio: 'inherit' });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

main();
