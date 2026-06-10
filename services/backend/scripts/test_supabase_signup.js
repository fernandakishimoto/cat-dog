#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/../.env' });
const { createClient } = require('@supabase/supabase-js');
// Provide WebSocket transport for Node.js < 22
let wsTransport;
try {
  wsTransport = require('ws');
} catch (e) {
  wsTransport = undefined;
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, wsTransport ? { realtime: { transport: wsTransport } } : undefined);

async function run() {
  const email = process.argv[2] || `test+${Date.now()}@example.com`;
  const password = process.argv[3] || 'Test1234';
  console.log('Testing signUp with', email);
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log('Result:', JSON.stringify({ data, error }, null, 2));
    if (error) process.exit(2);
  } catch (err) {
    console.error('Exception during signUp:', err);
    process.exit(3);
  }
}

run();
