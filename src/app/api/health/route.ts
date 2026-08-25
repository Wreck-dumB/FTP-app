import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    site_url: !!process.env.NEXT_PUBLIC_SITE_URL,
    seed_endpoint_enabled: !!process.env.SEED_SECRET,
    timestamp: new Date().toISOString(),
  };

  const allOk = Object.values(checks)
    .filter((v) => typeof v === 'boolean')
    .every((v) => v);

  return NextResponse.json(
    { ok: allOk, ...checks },
    { status: allOk ? 200 : 500 }
  );
}
