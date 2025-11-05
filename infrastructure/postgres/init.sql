-- Initial database setup for Cruise Recruitment System
-- This script runs on first database initialization

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- Set timezone
SET timezone = 'UTC';

-- Create schemas
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS audit;

-- Basic tables will be created via migrations
-- This is just the initialization script

