import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    
    const supabase = await createServiceRoleClient();

    // Download the file from Supabase Storage
    // Files are stored in profile-images/ folder
    const filepath = `profile-images/${filename}`;
    const { data, error } = await supabase.storage
      .from('billabong')
      .download(filepath);

    if (error) {
      console.error('Error downloading image:', error);
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await data.arrayBuffer());

    // Return the image with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': data.type || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

