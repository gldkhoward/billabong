import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const homieId = formData.get('homieId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!homieId) {
      return NextResponse.json(
        { error: 'No homie ID provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `${homieId}_${timestamp}.${fileExtension}`;
    const filepath = `profile-images/${filename}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('billabong')
      .upload(filepath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Create API-proxied URL instead of direct Supabase URL
    // This works with authenticated storage access
    const apiProxiedUrl = `/api/profile-image/${filename}`;

    // Update homie record with image URL
    const { error: updateError } = await supabase
      .from('homies')
      .update({ homie_image_url: apiProxiedUrl })
      .eq('id', homieId);

    if (updateError) {
      console.error('Update error:', updateError);
      // Still return success since image was uploaded
      return NextResponse.json({
        success: true,
        url: apiProxiedUrl,
        warning: 'Image uploaded but database update failed',
      });
    }

    return NextResponse.json({
      success: true,
      url: apiProxiedUrl,
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

