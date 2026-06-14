"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for the Radiant app.
 *
 * No authentication is used — every visitor talks to the database through the
 * public "publishable" key. Row Level Security on the database restricts the
 * public key to reading/inserting/updating the form tables only.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
