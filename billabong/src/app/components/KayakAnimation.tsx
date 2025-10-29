'use client';

import { memo } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const KayakAnimation = memo(function KayakAnimation() {
  return (
    <>
      {/* First Kayak */}
      <div className="kayak-float">
        <DotLottieReact
          src="https://lottie.host/e6eecad2-edcb-4b58-8a5e-de7fee378cc6/eNfOjQiZCm.lottie"
          loop
          autoplay
          speed={1}
        />
      </div>
      
      {/* Second Kayak - follows the first */}
      <div className="kayak-float-2">
        <DotLottieReact
          src="https://lottie.host/e6eecad2-edcb-4b58-8a5e-de7fee378cc6/eNfOjQiZCm.lottie"
          loop
          autoplay
          speed={1}
        />
      </div>
    </>
  );
});

