import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Code is required' },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Check if the code exists and hasn't expired
    const { data, error } = await supabase
      .from('welcome_codes')
      .select('id, expires_at')
      .eq('code', code)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { valid: false, error: 'Invalid code' },
        { status: 401 }
      );
    }

    // Check if the code has expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);

    if (now > expiresAt) {
      return NextResponse.json(
        { valid: false, error: 'Code has expired' },
        { status: 401 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Error validating welcome code:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate code' },
      { status: 500 }
    );
  }
}

