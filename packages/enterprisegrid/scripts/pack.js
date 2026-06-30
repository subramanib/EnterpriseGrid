import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(PACKAGE_ROOT, '../..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

console.log('=== EnterpriseGrid Packing Tool ===');
console.log('Package Root:', PACKAGE_ROOT);
console.log('Project Root:', PROJECT_ROOT);
console.log('Public Dir:', PUBLIC_DIR);

try {
  // Ensure public directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // 1. Build the package
  console.log('Building the enterprise grid package...');
  execSync('npm run build', { cwd: PACKAGE_ROOT, stdio: 'inherit' });

  // 2. Pack the package as TGZ
  console.log('Packing the package to TGZ...');
  const stdout = execSync('npm pack', { cwd: PACKAGE_ROOT, encoding: 'utf8' });
  const tarballName = stdout.trim();
  const sourcePath = path.join(PACKAGE_ROOT, tarballName);
  const targetPath = path.join(PUBLIC_DIR, tarballName);

  // Move TGZ to public
  if (fs.existsSync(sourcePath)) {
    fs.renameSync(sourcePath, targetPath);
    console.log(`Successfully packed and moved tarball to public directory!`);
    console.log(`Filename: ${tarballName}`);
    console.log(`Download URL: /${tarballName}`);
  } else {
    throw new Error(`Could not find generated tarball at: ${sourcePath}`);
  }

  // 3. Pack the package as ZIP
  console.log('Packing the package to ZIP...');
  const zip = new AdmZip();
  
  // Add files to zip
  const filesToInclude = ['package.json', 'README.md', 'CHANGELOG.md'];
  filesToInclude.forEach(file => {
    const filePath = path.join(PACKAGE_ROOT, file);
    if (fs.existsSync(filePath)) {
      zip.addLocalFile(filePath);
    }
  });

  // Add dist directory recursively under a 'dist' folder inside the zip
  const distDir = path.join(PACKAGE_ROOT, 'dist');
  if (fs.existsSync(distDir)) {
    zip.addLocalFolder(distDir, 'dist');
  }

  // Save the zip file to public
  const zipName = tarballName.replace('.tgz', '.zip');
  const zipPath = path.join(PUBLIC_DIR, zipName);
  zip.writeZip(zipPath);
  console.log(`Successfully packed and moved ZIP to public directory!`);
  console.log(`Filename: ${zipName}`);
  console.log(`Download URL: /${zipName}`);
} catch (error) {
  console.error('Error during packing:', error);
  process.exit(1);
}
