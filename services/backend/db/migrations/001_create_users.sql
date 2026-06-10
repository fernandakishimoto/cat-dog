-- 001_create_users.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  role VARCHAR(50) NOT NULL DEFAULT 'user'
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
