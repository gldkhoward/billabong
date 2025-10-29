'use client';

import { memo } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const PeopleAnimation = memo(function PeopleAnimation() {
  return (
    <div className="people-animation">
      <DotLottieReact 
        src="https://lottie.host/b9526bd2-cf21-44b3-9864-bb3717957fb5/eIEJaRIKOB.lottie" 
        loop 
        autoplay
        speed={1}
      />
    </div>
  );
});