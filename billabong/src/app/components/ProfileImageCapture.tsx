'use client';

import { useState, useRef, useEffect } from 'react';
import { processProfileImage, validateImageFile } from '@/utils/image';

interface ProfileImageCaptureProps {
  onImageCaptured: (blob: Blob) => void;
  onSkip: () => void;
}

type CaptureMode = 'choose' | 'camera' | 'upload' | 'preview';

export function ProfileImageCapture({ onImageCaptured, onSkip }: ProfileImageCaptureProps) {
  const [mode, setMode] = useState<CaptureMode>('choose');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processedBlobRef = useRef<Blob | null>(null);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      setVideoReady(false);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 1280 }
        }
      });
      
      setStream(mediaStream);
      setMode('camera');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video metadata to load
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          if (videoRef.current) {
            console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
            videoRef.current.play()
              .then(() => {
                console.log('Video playing');
                setVideoReady(true);
              })
              .catch(err => {
                console.error('Error playing video:', err);
                setError('Could not play video');
              });
          }
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please allow camera access or upload a photo instead.');
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current) {
      setError('Video not ready');
      return;
    }

    const video = videoRef.current;
    
    // Check if video has loaded
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('Video not ready. Please wait a moment and try again.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Could not create canvas context');
      return;
    }

    // Draw the video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL
    const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    if (!imageUrl || imageUrl === 'data:,') {
      setError('Failed to capture image. Please try again.');
      return;
    }
    
    setCapturedImage(imageUrl);
    setMode('preview');
    setError(null);
    
    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target?.result as string);
      setMode('preview');
    };
    reader.readAsDataURL(file);
  };

  // Process and confirm image
  const confirmImage = async () => {
    if (!capturedImage) return;

    setProcessing(true);
    setError(null);

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

      // Process image (crop and resize)
      const processedBlob = await processProfileImage(file, 400);
      processedBlobRef.current = processedBlob;
      
      onImageCaptured(processedBlob);
    } catch (err) {
      console.error('Processing error:', err);
      setError('Failed to process image. Please try again.');
      setProcessing(false);
    }
  };

  // Retake photo
  const retake = () => {
    setCapturedImage(null);
    processedBlobRef.current = null;
    setMode('choose');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600 font-body">{error}</p>
        </div>
      )}

      {/* Choose Mode */}
      {mode === 'choose' && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-river-teal/10 flex items-center justify-center">
              <svg className="w-16 h-16 text-river-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-body text-charcoal/70 text-sm">
              Take a photo somewhere in the house. It helps people recognize you!
            </p>
          </div>

          <button
            onClick={startCamera}
            className="w-full px-6 py-4 bg-river-teal text-white rounded-xl font-heading font-semibold hover:bg-deep-indigo transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Take Photo
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-6 py-4 border-2 border-river-teal text-river-teal rounded-xl font-heading font-semibold hover:bg-river-teal hover:text-white transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Photo
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Camera Mode */}
      {mode === 'camera' && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-charcoal aspect-square">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Square crop overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square border-4 border-white/80 rounded-2xl shadow-2xl">
                <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-river-teal" />
                <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-river-teal" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-river-teal" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-river-teal" />
              </div>
            </div>
          </div>

          <div className="text-center">
            {!videoReady && (
              <p className="font-body text-sm text-charcoal/70 mb-2">
                📹 Loading camera...
              </p>
            )}
            {videoReady && (
              <p className="font-body text-sm text-river-teal font-semibold mb-2">
                ✓ Camera ready! Position your face in the square
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                if (stream) {
                  stream.getTracks().forEach(track => track.stop());
                  setStream(null);
                }
                setVideoReady(false);
                setMode('choose');
              }}
              className="flex-1 px-6 py-4 border-2 border-charcoal/20 text-charcoal rounded-xl font-heading font-semibold hover:bg-charcoal/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              disabled={!videoReady}
              className="flex-1 px-6 py-4 bg-river-teal text-white rounded-xl font-heading font-semibold hover:bg-deep-indigo transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {videoReady ? 'Capture' : 'Loading...'}
            </button>
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {mode === 'preview' && capturedImage && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-charcoal aspect-square">
            <img
              src={capturedImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            
            {/* Square crop indicator */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square border-4 border-white/80 rounded-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-sm font-body bg-black/50 px-3 py-1 rounded-lg">
                    This area will be your profile photo
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={retake}
              disabled={processing}
              className="flex-1 px-6 py-4 border-2 border-charcoal/20 text-charcoal rounded-xl font-heading font-semibold hover:bg-charcoal/5 transition-all disabled:opacity-50"
            >
              Retake
            </button>
            <button
              onClick={confirmImage}
              disabled={processing}
              className="flex-1 px-6 py-4 bg-river-teal text-white rounded-xl font-heading font-semibold hover:bg-deep-indigo transition-all disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Looks Good!'}
            </button>
          </div>
        </div>
      )}

      {/* Skip Button */}
      {mode === 'choose' && (
        <button
          onClick={onSkip}
          className="w-full text-center text-sm text-charcoal/60 hover:text-river-teal transition-colors font-body"
        >
          Skip for now →
        </button>
      )}
    </div>
  );
}

