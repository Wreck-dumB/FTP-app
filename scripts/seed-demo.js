#!/usr/bin/env node
/*
 Demo seed script for Forward Thinking Parents (SparkPlay/FTP)

 Usage (locally):
 1. Copy `.env.local.example` to `.env.local` and set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 2. Run: `npm run seed:demo`

 This script creates two test users, a family, two family members, a child, and a simple weekly custody schedule.
 It requires the Supabase service_role key (sensitive) — do not use in production or commit it.
*/

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. Aborting.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function run() {
  console.log('Seeding demo data...');

  // Create two auth users (admin API)
  const u1 = await supabase.auth.admin.createUser({
    email: `demo_parentA+${Date.now()}@example.com`,
    password: 'DemoPass123!'
  });
  const u2 = await supabase.auth.admin.createUser({
    email: `demo_parentB+${Date.now()}@example.com`,
    password: 'DemoPass123!'
  });

  if (u1.error || u2.error) {
    console.error('Error creating demo users', u1.error || u2.error);
    process.exit(1);
  }

  const userA = u1.user;
  const userB = u2.user;

  console.log('Created users:', userA.id, userB.id);

  // Create a family (bypass helper to set created_by)
  const { data: familyData, error: familyErr } = await supabase
    .from('families')
    .insert([{ name: 'The Demo Family', created_by: userA.id }])
    .select('*')
    .single();

  if (familyErr) {
    console.error('Error creating family', familyErr);
    process.exit(1);
  }

  const family = familyData;
  console.log('Created family', family.id);

  // Create family_members
  const { error: membersErr } = await supabase.from('family_members').insert([
    { family_id: family.id, user_id: userA.id, role: 'parent', display_name: 'Parent A', color: '#3b82f6' },
    { family_id: family.id, user_id: userB.id, role: 'parent', display_name: 'Parent B', color: '#f97316' }
  ]);

  if (membersErr) {
    console.error('Error creating family members', membersErr);
    process.exit(1);
  }

  console.log('Created family members');

  // Insert a child
  const { data: childData, error: childErr } = await supabase.from('children').insert([
    { family_id: family.id, first_name: 'Jamie', date_of_birth: '2017-05-01', created_by: userA.id }
  ]).select('*').single();

  if (childErr) {
    console.error('Error creating child', childErr);
    process.exit(1);
  }

  console.log('Created child', childData.id);

  // Create a simple weekly schedule
  const { data: schedule, error: scheduleErr } = await supabase.from('custody_schedules').insert([
    { family_id: family.id, name: 'Weekly split', pattern_type: 'weekly', cycle_start_date: new Date().toISOString().slice(0,10), cycle_length_days: 7 }
  ]).select('*').single();

  if (scheduleErr) {
    console.error('Error creating schedule', scheduleErr);
    process.exit(1);
  }

  // Get one member id to assign blocks
  const { data: members } = await supabase.from('family_members').select('*').eq('family_id', family.id);
  const memberA = members[0];
  const memberB = members[1];

  // Create blocks: Parent A has Mon-Fri, Parent B has Sat-Sun (example)
  const { error: blocksErr } = await supabase.from('custody_schedule_blocks').insert([
    { schedule_id: schedule.id, parent_member_id: memberA.id, cycle_day_start: 1, cycle_day_end: 5, start_time: '00:00', end_time: '23:59', label: 'Weekdays' },
    { schedule_id: schedule.id, parent_member_id: memberB.id, cycle_day_start: 6, cycle_day_end: 7, start_time: '00:00', end_time: '23:59', label: 'Weekends' }
  ]);

  if (blocksErr) {
    console.error('Error creating schedule blocks', blocksErr);
    process.exit(1);
  }

  console.log('Seed complete. Demo family id:', family.id);
  console.log('Log in with the created demo emails via the Supabase Auth admin console if needed.');
}

run().catch((err) => {
  console.error('Unexpected error', err);
  process.exit(1);
});
