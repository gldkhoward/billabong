import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service';

export async function GET() {
  try {
    const supabase = await createServiceRoleClient();
    
    // Fetch all homies with their latest visit info
    const { data: homiesData, error: homiesError } = await supabase
      .from('homies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (homiesError) {
      console.error('Error fetching homies:', homiesError);
      return NextResponse.json({ error: homiesError.message }, { status: 500 });
    }
    
    // Fetch active visits
    const { data: activeVisits, error: visitsError } = await supabase
      .from('visits')
      .select('homie_id, checkin_at')
      .is('checkout_at', null);
    
    if (visitsError) {
      console.error('Error fetching active visits:', visitsError);
      return NextResponse.json({ error: visitsError.message }, { status: 500 });
    }
    
    // Create a map of active homie IDs to their checkin times
    const activeHomieMap = new Map(
      activeVisits?.map(v => [v.homie_id, v.checkin_at]) || []
    );
    
    // Transform all homies to include active status
    const allGuests = homiesData?.map((homie) => {
      const checkin_at = activeHomieMap.get(homie.id);
      return {
        id: homie.id,
        first_name: homie.first_name,
        last_name: homie.last_name,
        email: homie.email,
        github_url: homie.github_url,
        linkedin_url: homie.linkedin_url,
        instagram_url: homie.instagram_url,
        x_handle: homie.x_handle,
        website_url: homie.website_url,
        homie_image_url: homie.homie_image_url,
        where_from: homie.where_from,
        why_billabong: homie.why_billabong,
        working_on: homie.working_on,
        how_to_help: homie.how_to_help,
        is_active: checkin_at !== undefined,
        checkin_at: checkin_at || null,
      };
    }) || [];
    
    // Sort: active guests first (by checkin time), then inactive guests
    allGuests.sort((a, b) => {
      if (a.is_active && !b.is_active) return -1;
      if (!a.is_active && b.is_active) return 1;
      if (a.is_active && b.is_active && a.checkin_at && b.checkin_at) {
        return new Date(b.checkin_at).getTime() - new Date(a.checkin_at).getTime();
      }
      return 0;
    });
    
    return NextResponse.json(allGuests);
  } catch (error) {
    console.error('Error in guests API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}

