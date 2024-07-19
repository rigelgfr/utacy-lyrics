// AnimatedBackground.js
import { useEffect, useRef } from 'react';

const LoopingBackground = () => {
  const pxRef = useRef(0);

  useEffect(() => {
    const animateBg = () => {
      pxRef.current -= 0.1;
      document.querySelector('.body-div').style.backgroundPosition = `${pxRef.current}px 0px`;
      requestAnimationFrame(animateBg);
    };
    animateBg();
  }, []);

  return null;
};

export default LoopingBackground;
