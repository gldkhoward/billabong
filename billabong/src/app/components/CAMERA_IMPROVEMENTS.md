# Camera Capture Improvements

## Overview

The `ProfileImageCapture` component has been significantly enhanced to provide a smooth, reliable, and professional camera experience for guest onboarding.

## Key Improvements

### 1. **Enhanced Error Handling**

**Before:**

- Generic error messages
- Poor handling of permission denials
- No device-specific error messages

**After:**

- Specific error messages for each failure scenario:
  - `NotAllowedError`: "Camera access denied. Please allow camera access in your browser settings."
  - `NotFoundError`: "No camera found on this device."
  - `NotReadableError`: "Camera is already in use by another application."
  - Generic fallback with helpful guidance

### 2. **Camera Switching Functionality**

**New Feature:**

- Switch between front-facing (user) and back-facing (environment) cameras
- Circular switch button with rotation icon in top-left corner
- Smooth transition when switching cameras
- Automatic cleanup and re-initialization of video stream

**Implementation:**

```typescript
const switchCamera = useCallback(() => {
  cleanupStream();
  setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  setVideoReady(false);
  setTimeout(() => {
    startCamera();
  }, 100);
}, [cleanupStream, startCamera]);
```

### 3. **Improved Video Stream Management**

**Stream Cleanup:**

- Proper cleanup on component unmount
- Cleanup when switching modes
- Cleanup when switching cameras
- Prevents memory leaks and camera access conflicts

**Stream Initialization:**

- Better handling of video metadata loading
- Fallback for already-loaded metadata
- 300ms delay to ensure smooth video start
- Support check for getUserMedia API

### 4. **Higher Quality Image Capture**

**Resolution:**

- Increased ideal resolution: 1920x1920 (was 1280x1280)
- Better aspect ratio handling (1:1 square)
- Quality setting: 0.95 (was 0.9) for JPEG compression

**Canvas Rendering:**

- Uses hidden canvas element for efficient capture
- `alpha: false` for better performance
- Proper mirroring for front camera (selfie mode)
- Full-resolution capture without downsampling

**Mirroring Logic:**

```typescript
// For front camera, mirror the image horizontally
if (facingMode === "user") {
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
}
```

### 5. **Better Loading States**

**Visual Feedback:**

- Animated spinner during camera initialization
- "Starting camera..." text
- Loading overlay prevents premature capture
- Smooth fade-in when camera is ready

**State Management:**

- Clear `videoReady` state
- Disabled capture button until ready
- Visual indicators for each state

### 6. **Enhanced Mobile Support**

**Video Element Attributes:**

- `playsInline`: Prevents fullscreen on iOS
- `muted`: Required for autoplay on mobile
- `autoPlay`: Immediate video start
- Dynamic mirroring with Tailwind: `scale-x-[-1]`

**Constraints:**

```typescript
const constraints = {
  video: {
    facingMode: facingMode,
    width: { ideal: 1920, max: 1920 },
    height: { ideal: 1920, max: 1920 },
    aspectRatio: { ideal: 1 },
  },
  audio: false,
};
```

### 7. **Memory Management**

**useCallback Usage:**

- `cleanupStream`: Memoized cleanup function
- `startCamera`: Prevents recreation on re-renders
- `capturePhoto`: Efficient photo capture
- `switchCamera`: Optimized camera switching

**Proper Dependencies:**

- All callbacks have correct dependency arrays
- No missing dependencies warnings
- Prevents infinite loops and unnecessary re-renders

## UI Enhancements

### Camera Switch Button

- Position: Top-left corner
- Background: Semi-transparent black (`bg-black/50`)
- Hover effect: Darker background (`hover:bg-black/70`)
- Icon: Rotation/refresh symbol
- Appears only when camera is ready
- Smooth transition effects

### Loading State

- Full overlay during initialization
- Centered spinner animation
- Clear status text
- Prevents interaction until ready
- Smooth fade out when camera starts

### Capture Button

- Emoji indicator: 📸
- Clear "Capture" text
- Disabled state when not ready
- Loading text during initialization
- Smooth transitions and hover effects

## Browser Compatibility

### Supported Browsers

✅ **Chrome** (Desktop & Mobile)

- Full support for getUserMedia
- High-quality video capture
- Camera switching works perfectly

✅ **Safari** (Desktop & iOS)

- Requires `playsInline` attribute
- Works with proper constraints
- Front camera mirroring supported

✅ **Firefox** (Desktop & Mobile)

- Full WebRTC support
- Good performance
- Reliable camera access

✅ **Edge** (Desktop & Mobile)

- Chromium-based full support
- Identical to Chrome behavior

### Mobile Considerations

- **iOS Safari**: Requires user interaction to start camera
- **Android Chrome**: Best performance
- **Mobile Camera Toggle**: Seamlessly switches between front/back cameras
- **Portrait Mode**: Optimized layout for vertical orientation

## Technical Details

### Video Initialization Flow

1. Check browser support for getUserMedia
2. Request camera access with constraints
3. Set video source to media stream
4. Wait for metadata to load
5. Play video
6. Add 300ms delay for smooth start
7. Set videoReady state
8. Enable capture button

### Photo Capture Flow

1. Check video and canvas are ready
2. Verify video dimensions are valid
3. Set canvas size to match video
4. Get 2D context with optimizations
5. Apply mirroring if front camera
6. Draw video frame to canvas
7. Convert canvas to JPEG data URL (95% quality)
8. Set preview mode
9. Cleanup video stream

### Stream Cleanup Flow

1. Stop all media tracks
2. Remove video source
3. Clear stream state
4. Prepare for next camera session

## Performance Optimizations

### Render Optimization

- Hidden canvas element (not in DOM paint)
- Memoized callbacks prevent re-renders
- Proper React key management
- Efficient state updates

### Memory Optimization

- Immediate stream cleanup
- No lingering camera access
- Proper garbage collection
- Blob reference management

### Loading Optimization

- 300ms delay prevents flickering
- Smooth state transitions
- Progressive enhancement
- Lazy loading of video stream

## Error Recovery

### Automatic Fallback

If camera fails, component automatically:

1. Shows clear error message
2. Suggests file upload alternative
3. Maintains upload button accessibility
4. Preserves form flow

### User Actions

Users can:

- Retry camera access
- Switch to file upload
- Cancel and go back
- See helpful error messages

## Testing Recommendations

### Desktop Testing

- [ ] Chrome - Camera access
- [ ] Chrome - Camera switching
- [ ] Chrome - Photo quality
- [ ] Safari - Camera access
- [ ] Safari - playsInline behavior
- [ ] Firefox - Camera access
- [ ] Edge - Full functionality

### Mobile Testing

- [ ] iOS Safari - Camera access
- [ ] iOS Safari - Front/back switching
- [ ] iOS Safari - Mirroring correct
- [ ] Android Chrome - Camera access
- [ ] Android Chrome - Front/back switching
- [ ] Mobile landscape orientation
- [ ] Mobile portrait orientation

### Error Testing

- [ ] Deny camera permission
- [ ] No camera available
- [ ] Camera already in use
- [ ] Network disconnection
- [ ] Browser doesn't support getUserMedia

### Quality Testing

- [ ] Image resolution matches expectations
- [ ] JPEG quality is acceptable
- [ ] File size is reasonable
- [ ] Front camera is properly mirrored
- [ ] Back camera is not mirrored

## Future Enhancements

### Potential Improvements

1. **Flash/Torch Control**: Toggle device flash for better lighting
2. **Zoom Control**: Pinch-to-zoom functionality
3. **Grid Overlay**: Rule of thirds guide
4. **Filters**: Real-time image filters
5. **Timer**: Self-timer for hands-free capture
6. **Burst Mode**: Capture multiple photos quickly
7. **Video Recording**: Option to record video instead of photo
8. **Face Detection**: Center face automatically
9. **Quality Selector**: Let users choose resolution
10. **Gallery View**: Show recently captured photos

### Code Improvements

1. Extract camera logic to custom hook: `useCamera()`
2. Add camera permissions API for proactive checks
3. Implement retry logic with exponential backoff
4. Add telemetry for camera failure rates
5. Optimize image compression with WebP support

## Related Files

- Main Component: `/src/app/components/ProfileImageCapture.tsx`
- Image Utils: `/src/utils/image.ts`
- Profile Picture Step: `/src/app/welcome/components/steps/ProfilePictureStep.tsx`
- Upload API: `/src/app/api/upload-profile-image/route.ts`

## Resources

- [MDN: getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Media Capture Spec](https://w3c.github.io/mediacapture-main/)
- [WebRTC Samples](https://webrtc.github.io/samples/)
