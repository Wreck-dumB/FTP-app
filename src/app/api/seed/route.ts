import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const seedSecret = process.env.SEED_SECRET;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!seedSecret || !serviceKey) {
    return NextResponse.json({ error: 'Server not configured for seeding' }, { status: 500 });
  }

  const incoming = req.headers.get('x-seed-secret') || req.nextUrl.searchParams.get('secret');
  if (incoming !== seedSecret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return NextResponse.json({ error: 'Missing SUPABASE_URL' }, { status: 500 });

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // Minimal demo data: family + two members
    const { data: family } = await supabase.from('families').insert([{ name: 'Demo Family', created_by: null }]).select('*').single();
    if (!family) throw new Error('Family creation failed');

    await supabase.from('family_members').insert([
      { family_id: family.id, user_id: null, role: 'parent', display_name: 'Parent A', color: '#3b82f6' },
      { family_id: family.id, user_id: null, role: 'parent', display_name: 'Parent B', color: '#f97316' }
    ]);

    return NextResponse.json({ ok: true, family_id: family.id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
