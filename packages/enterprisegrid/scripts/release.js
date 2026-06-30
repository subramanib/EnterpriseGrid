#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const PACKAGE_JSON_PATH = path.join(PACKAGE_ROOT, 'package.json');
const CHANGELOG_PATH = path.join(PACKAGE_ROOT, 'CHANGELOG.md');

// Utility for output styling
const log = {
  info: (msg) => console.log(`\x1b[34mℹ\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m✔\x1b[0m ${msg}`),
  error: (msg) => console.error(`\x1b[31m✖ [ERROR]\x1b[0m ${msg}`),
  header: (msg) => console.log(`\n\x1b[35m=== ${msg} ===\x1b[0m`)
};

function runCommand(command, cwd = PACKAGE_ROOT) {
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log.error(`Command failed: ${command}`);
    return false;
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const bumpType = args[0] || 'patch'; // 'patch', 'minor', 'major', or direct version like '1.1.0'
  return bumpType;
}

function bumpVersion(currentVersion, bumpType) {
  if (['patch', 'minor', 'major'].includes(bumpType)) {
    const parts = currentVersion.split('.').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      throw new Error(`Invalid current version format: ${currentVersion}`);
    }

    if (bumpType === 'major') {
      parts[0] += 1;
      parts[1] = 0;
      parts[2] = 0;
    } else if (bumpType === 'minor') {
      parts[1] += 1;
      parts[2] = 0;
    } else if (bumpType === 'patch') {
      parts[2] += 1;
    }
    return parts.join('.');
  }

  // Assume the argument is a direct custom version string
  if (/^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/.test(bumpType)) {
    return bumpType;
  }

  throw new Error(`Invalid bump type or version structure. Use: patch, minor, major, or an exact version (e.g., 1.2.3).`);
}

function updatePackageJson(newVersion) {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  const oldVersion = pkg.version;
  pkg.version = newVersion;
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  log.success(`Updated package.json: v${oldVersion} ➔ v${newVersion}`);
  return oldVersion;
}

function updateChangelog(newVersion) {
  if (!fs.existsSync(CHANGELOG_PATH)) {
    log.info('Changelog not found, skipping changelog update.');
    return;
  }

  const currentDate = new Date().toISOString().split('T')[0];
  const changelogContent = fs.readFileSync(CHANGELOG_PATH, 'utf8');

  // Insert release section block under header
  const headerMarker = 'All notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n---\n';
  const newReleaseBlock = `\n## [${newVersion}] - ${currentDate}\n\n### Added\n- Describe new features here...\n\n### Changed\n- Describe modified components here...\n\n### Fixed\n- Describe bugfixes here...\n`;

  let updatedChangelog;
  if (changelogContent.includes(headerMarker)) {
    updatedChangelog = changelogContent.replace(headerMarker, headerMarker + newReleaseBlock);
  } else {
    // Fallback prepending
    updatedChangelog = `# Changelog\n${newReleaseBlock}\n${changelogContent.replace(/# Changelog\s*/, '')}`;
  }

  fs.writeFileSync(CHANGELOG_PATH, updatedChangelog, 'utf8');
  log.success(`Added release placeholder block for [${newVersion}] in CHANGELOG.md`);
}

function main() {
  log.header('EnterpriseGrid Release Tool');

  try {
    const bumpType = parseArgs();
    
    // Check files exist
    if (!fs.existsSync(PACKAGE_JSON_PATH)) {
      throw new Error(`Could not find package.json at ${PACKAGE_JSON_PATH}`);
    }

    const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    const currentVersion = pkg.version;

    log.info(`Current package version: v${currentVersion}`);
    const newVersion = bumpVersion(currentVersion, bumpType);
    log.info(`Target package version:  v${newVersion}`);

    // 1. Update package.json version
    updatePackageJson(newVersion);

    // 2. Prepend CHANGELOG.md version entry
    updateChangelog(newVersion);

    // 3. Build the package with new version to verify types and assets compilation
    log.info('Compiling distribution bundles for validation...');
    const buildSuccess = runCommand('npm run build');

    if (buildSuccess) {
      log.success(`Release preparation completed!`);
      log.info(`Ready to publish:`);
      log.info(`  1. Open packages/enterprisegrid/CHANGELOG.md and refine your release notes.`);
      log.info(`  2. Commit changes, tag the release (git tag v${newVersion}), and publish (npm publish packages/enterprisegrid).`);
    } else {
      log.error('Build failed. Reverting version changes...');
      updatePackageJson(currentVersion);
    }
  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }
}

main();
