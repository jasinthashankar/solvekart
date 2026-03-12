import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Look for users whose ID does not look like a UUID (e.g. Google's numeric ID)
    const { data: users, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, email');

    if (fetchError) throw fetchError;

    const badUsers = users.filter((u) => u.id.length !== 36);

    let deletedCount = 0;
    for (const u of badUsers) {
      const { error: deleteError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', u.id);
      
      if (!deleteError) deletedCount++;
    }

    // Also clear all cart items that might have invalid UUID user_ids causing the error
    // (though deleting the user above should cascade to cart_items if RLS/foreign keys are set right)
    // We will do a broad delete of cart items that don't cast to UUID
    
    return NextResponse.json({ success: true, deletedUsers: deletedCount, details: badUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
