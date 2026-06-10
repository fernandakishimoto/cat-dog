#!/usr/bin/env node
/**
 * Migration runner using Supabase CLI (supabase db query).
 * Requires: supabase login + supabase link --project-ref <ref>
 *
 * Tracks executed migrations in a local .migrations_log file.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.resolve(__dirname, '../db/migrations');
const LOG_FILE = path.resolve(__dirname, '../db/.migrations_log');

function getExecutedMigrations() {
  if (!fs.existsSync(LOG_FILE)) return [];
  return fs.readFileSync(LOG_FILE, 'utf-8').split('\n').filter(Boolean);
}

function logMigration(name) {
  fs.appendFileSync(LOG_FILE, name + '\n');
}

function getMigrationFiles() {
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();
}

function runMigration(file) {
  const filePath = path.join(MIGRATIONS_DIR, file);
  console.log(`Running migration: ${file}`);
  const result = spawnSync('supabase', ['db', 'query', '--linked', '--file', filePath], {
    stdio: 'inherit',
    env: { ...process.env, PATH: `${process.env.HOME}/bin:${process.env.PATH}` },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function main() {
  const executed = getExecutedMigrations();
  const files = getMigrationFiles();
  const pending = files.filter(f => !executed.includes(f));

  if (pending.length === 0) {
    console.log('No pending migrations.');
    return;
  }

  console.log(`Found ${pending.length} pending migration(s).`);

  for (const file of pending) {
    runMigration(file);
    logMigration(file);
    console.log(`  ✓ ${file}`);
  }

  console.log('All migrations applied successfully.');
}

main();
