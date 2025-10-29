/**
 * Image processing utilities for profile pictures
 */

/**
 * Crop image to center square
 */
export async function cropImageToSquare(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Determine the size of the square (smallest dimension)
      const size = Math.min(img.width, img.height);
      
      // Set canvas to square size
      canvas.width = size;
      canvas.height = size;

      // Calculate the position to center the image
      const offsetX = (img.width - size) / 2;
      const offsetY = (img.height - size) / 2;

      // Draw the center portion of the image
      ctx.drawImage(
        img,
        offsetX, offsetY, size, size, // Source rectangle (center square)
        0, 0, size, size // Destination rectangle (full canvas)
      );

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.9);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Resize image to specific dimensions
 */
export async function resizeImage(blob: Blob, targetSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      canvas.width = targetSize;
      canvas.height = targetSize;

      // Draw and resize
      ctx.drawImage(img, 0, 0, targetSize, targetSize);

      canvas.toBlob((resizedBlob) => {
        if (resizedBlob) {
          resolve(resizedBlob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.85);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(blob);
  });
}

/**
 * Process profile image: crop to square and resize to target size
 */
export async function processProfileImage(file: File, targetSize: number = 400): Promise<Blob> {
  // First crop to square
  const squareBlob = await cropImageToSquare(file);
  
  // Then resize to target size
  const resizedBlob = await resizeImage(squareBlob, targetSize);
  
  return resizedBlob;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a JPEG, PNG, or WebP image',
    };
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image must be smaller than 5MB',
    };
  }

  return { valid: true };
}

/**
 * Capture image from video stream
 */
export function captureImageFromVideo(video: HTMLVideoElement): Blob | null {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // Set canvas size to video dimensions
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw video frame to canvas
  ctx.drawImage(video, 0, 0);

  // Convert to blob
  let blob: Blob | null = null;
  canvas.toBlob((b) => {
    blob = b;
  }, 'image/jpeg', 0.9);

  return blob;
}

