-- ========================================================
-- VoltSpot EV Charging Network - Supabase Database Schema
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xkdacgndjryqwuhfaeew/sql
-- ========================================================

-- 1. Create Profiles Table (Drivers, Station Hosts & Super Admin)
create table if not exists public.profiles (
  id uuid default gen_random_uuid() primary key,
  phone text unique not null,
  name text not null,
  role text not null check (role in ('driver', 'host', 'superadmin')),
  vehicle text,
  host_subscription jsonb default '{"status": "pending"}'::jsonb,
  verified_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

-- Allow public read and write for authenticated / verified phone sessions
create policy "Allow public read access to profiles"
  on public.profiles for select
  using (true);

create policy "Allow public insert and update to profiles"
  on public.profiles for all
  using (true)
  with check (true);

-- 2. Create Charger Booking Requests Table
create table if not exists public.booking_requests (
  id text primary key,
  driver_name text not null,
  driver_phone text not null,
  vehicle text not null,
  station_name text not null,
  bay_id text not null,
  connector text not null,
  kw integer not null default 60,
  status text not null check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS for Booking Requests
alter table public.booking_requests enable row level security;

create policy "Allow all access to booking requests"
  on public.booking_requests for all
  using (true)
  with check (true);

-- 3. Create EV Stations & Hardware Connectors Table
create table if not exists public.stations (
  id text primary key,
  name text not null,
  location text not null,
  distance text,
  status text not null default 'available' check (status in ('available', 'in-use', 'offline', 'maintenance')),
  max_kw integer not null default 120,
  type text not null default 'Ultra DC',
  tariff numeric(5,2) not null default 18.00,
  bays_open integer not null default 2,
  total_bays integer not null default 4,
  rating numeric(2,1) default 4.8,
  connectors text[] default array['CCS2', 'Type 2'],
  created_at timestamptz default now()
);

-- Enable RLS for Stations
alter table public.stations enable row level security;

create policy "Allow public read access to stations"
  on public.stations for select
  using (true);

-- 4. Enable Supabase Realtime Replication for instant live notifications
alter publication supabase_realtime add table public.booking_requests;
alter publication supabase_realtime add table public.profiles;
