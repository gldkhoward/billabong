/**
 * Custom hook for handling profile image uploads
 */

import { useState } from 'react';

export function useProfileImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (
    profileImageBlob: Blob | null,
    homieId: string
  ): Promise<string | null> => {
    if (!profileImageBlob) return null;

    try {
      setUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', profileImageBlob, 'profile.jpg');
      formData.append('homieId', homieId);

      const response = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result.url;
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const resetError = () => setError(null);

  return {
    uploading,
    error,
    uploadImage,
    resetError,
  };
}

