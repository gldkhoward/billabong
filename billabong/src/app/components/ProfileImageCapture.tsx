'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { processProfileImage, validateImageFile } from '@/utils/image';

interface ProfileImageCaptureProps {
  onImageCaptured: (blob: Blob) => void;
  onSkip: () => void;
}

type CaptureMode = 'choose' | 'camera' | 'upload' | 'preview';

export function ProfileImageCapture({ onImageCaptured, onSkip }: ProfileImageCaptureProps) {
  const [mode, setMode] = useState<CaptureMode>('choose');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processedBlobRef = useRef<Blob | null>(null);

  // Cleanup stream on unmount or mode change
  const cleanupStream = useCallback(() => {
    setStream((currentStream) => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          track.stop();
        });
      }
      return null;
    });
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  // Setup video element when stream changes
  useEffect(() => {
    const setupVideo = async () => {
      // Only setup if we have a stream, video ref, and we're in camera mode
      setStream((currentStream) => {
        if (currentStream && videoRef.current && mode === 'camera') {
          console.log('Setting up video element with stream');
          videoRef.current.srcObject = currentStream;
          console.log('Video source set');
          
          // Wait for video to be ready
          const handleLoadedMetadata = () => {
            console.log('Video metadata loaded');
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  console.log('Video playing');
                  // Give a small delay to ensure video is fully playing
                  setTimeout(() => {
                    console.log('Setting video ready to true');
                    setVideoReady(true);
                  }, 300);
                })
                .catch(err => {
                  console.error('Error playing video:', err);
                  setError('Could not start video playback');
                });
            }
          };

          videoRef.current.onloadedmetadata = handleLoadedMetadata;
          
          // Fallback for cases where metadata is already loaded
          if (videoRef.current.readyState >= 2) {
            console.log('Video metadata already loaded, calling handler');
            handleLoadedMetadata();
          }
        }
        return currentStream;
      });
    };

    setupVideo();
  }, [mode]); // Run when mode changes

  // Start camera with improved error handling
  const startCamera = useCallback(async () => {
    console.log('Starting camera with facingMode:', facingMode);
    try {
      setError(null);
      setVideoReady(false);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      // Request camera with optimal settings
      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1920, max: 1920 },
          aspectRatio: { ideal: 1 }
        },
        audio: false
      };

      console.log('Requesting camera with constraints:', constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained:', mediaStream);
      
      // Set stream first, then change mode - this will trigger the useEffect above
      setStream(mediaStream);
      setMode('camera');
    } catch (err) {
      console.error('Camera error:', err);
      cleanupStream();
      
      // Provide helpful error messages
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera access denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No camera found on this device.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError('Camera is already in use by another application.');
        } else {
          setError(err.message || 'Could not access camera. Please try uploading a photo instead.');
        }
      } else {
        setError('Could not access camera. Please try uploading a photo instead.');
      }
    }
  }, [facingMode, cleanupStream]);

  // Capture photo from camera with improved quality
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Video not ready');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Check if video has loaded
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('Video not ready. Please wait a moment and try again.');
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      setError('Could not create canvas context');
      return;
    }

    // For front camera, mirror the image horizontally
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Draw the video frame to canvas with best quality
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL with high quality
    const imageUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    if (!imageUrl || imageUrl === 'data:,') {
      setError('Failed to capture image. Please try again.');
      return;
    }
    
    setCapturedImage(imageUrl);
    setMode('preview');
    setError(null);
    
    // Stop camera stream
    cleanupStream();
  }, [facingMode, cleanupStream]);

  // Switch camera facing mode (front/back)
  const switchCamera = useCallback(() => {
    cleanupStream();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setVideoReady(false);
    // Restart camera with new facing mode
    setTimeout(() => {
      startCamera();
    }, 100);
  }, [cleanupStream, startCamera]);

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
        <div className="space-y-3 sm:space-y-4">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 rounded-full bg-river-teal/10 flex items-center justify-center">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-river-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-body text-charcoal/70 text-xs sm:text-sm px-2">
              Take a photo somewhere in the house. It helps people recognize you!
            </p>
          </div>

          <button
            onClick={startCamera}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-river-teal text-white rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-deep-indigo transition-all flex items-center justify-center gap-2 sm:gap-3"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Take Photo
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-river-teal text-river-teal rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-river-teal hover:text-white transition-all flex items-center justify-center gap-2 sm:gap-3"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="space-y-3 sm:space-y-4">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-charcoal aspect-square">
            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Video element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
            
            {/* Camera switch button */}
            {videoReady && (
              <button
                onClick={switchCamera}
                className="absolute top-4 left-4 p-2 sm:p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all z-10"
                aria-label="Switch camera"
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
              </button>
            )}
            
            {/* Square crop overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square border-2 sm:border-4 border-white/80 rounded-xl sm:rounded-2xl shadow-2xl">
                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 sm:border-t-4 sm:border-l-4 border-river-teal" />
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 sm:border-t-4 sm:border-r-4 border-river-teal" />
                <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 sm:border-b-4 sm:border-l-4 border-river-teal" />
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 sm:border-b-4 sm:border-r-4 border-river-teal" />
              </div>
            </div>

            {/* Loading overlay */}
            {!videoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-charcoal">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-river-teal mb-4"></div>
                  <p className="font-body text-sm text-white">Starting camera...</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            {videoReady && (
              <p className="font-body text-xs sm:text-sm text-river-teal font-semibold mb-2 px-2">
                ✓ Camera ready! Position your face in the square
              </p>
            )}
          </div>

          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() => {
                cleanupStream();
                setVideoReady(false);
                setMode('choose');
              }}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-charcoal/20 text-charcoal rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-charcoal/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              disabled={!videoReady}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-river-teal text-white rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-deep-indigo transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {videoReady ? '📸 Capture' : 'Loading...'}
            </button>
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {mode === 'preview' && capturedImage && (
        <div className="space-y-3 sm:space-y-4">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-charcoal aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={capturedImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            
            {/* Square crop indicator */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square border-2 sm:border-4 border-white/80 rounded-xl sm:rounded-2xl">
                <div className="absolute inset-0 flex items-center justify-center px-2">
                  <p className="text-white text-xs sm:text-sm font-body bg-black/50 px-2 sm:px-3 py-1 rounded-lg text-center">
                    This area will be your profile photo
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={retake}
              disabled={processing}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-charcoal/20 text-charcoal rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-charcoal/5 transition-all disabled:opacity-50"
            >
              Retake
            </button>
            <button
              onClick={confirmImage}
              disabled={processing}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-river-teal text-white rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-deep-indigo transition-all disabled:opacity-50"
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
          className="w-full text-center text-xs sm:text-sm text-charcoal/60 hover:text-river-teal transition-colors font-body"
        >
          Skip for now →
        </button>
      )}
    </div>
  );
}

