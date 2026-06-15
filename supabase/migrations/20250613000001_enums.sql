-- =============================================================================
-- The Vault by Enter Aevum — Migration 001: Enums & Extensions
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Application user roles (extends Supabase auth.users)
CREATE TYPE public.user_role AS ENUM ('client', 'admin', 'staff');

-- Commission lifecycle
CREATE TYPE public.commission_status AS ENUM (
  'inquiry',
  'intake',
  'design_review',
  'concept_creation',
  'cad_development',
  'render_approval',
  'production',
  'quality_control',
  'shipped',
  'completed',
  'cancelled'
);

-- Jewelry piece categories
CREATE TYPE public.piece_type AS ENUM (
  'pendant',
  'ring',
  'bracelet',
  'necklace',
  'custom'
);

-- Commission story / milestone context
CREATE TYPE public.commission_story_type AS ENUM (
  'transformation',
  'achievement',
  'legacy',
  'relationship',
  'milestone',
  'symbolic',
  'other'
);

-- File categories for uploads
CREATE TYPE public.commission_file_category AS ENUM (
  'reference',
  'inspiration',
  'sketch',
  'cad',
  'render',
  'approval',
  'production',
  'qc',
  'shipping',
  'invoice',
  'other'
);

-- Message sender types
CREATE TYPE public.message_sender_type AS ENUM ('client', 'staff', 'system');

-- Payment types
CREATE TYPE public.payment_type AS ENUM (
  'design_deposit',
  'milestone',
  'production_final',
  'adjustment',
  'refund'
);

-- Payment status
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'processing',
  'succeeded',
  'failed',
  'refunded',
  'partially_refunded',
  'cancelled'
);

-- Design concept status
CREATE TYPE public.design_concept_status AS ENUM (
  'draft',
  'submitted',
  'revision_requested',
  'approved',
  'rejected'
);

-- CAD revision status
CREATE TYPE public.cad_revision_status AS ENUM (
  'draft',
  'submitted',
  'revision_requested',
  'approved',
  'rejected'
);

-- Production update types
CREATE TYPE public.production_update_type AS ENUM (
  'milestone',
  'note',
  'delay',
  'qc_pass',
  'qc_fail',
  'shipment'
);
