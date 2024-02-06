"use client";// Updated Background.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './Background.module.scss';

const Background = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const lerpPos = useRef({ x: 0, y: 0 });
  const [fps, setFps] = useState(60);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldFadeIn, setShouldFadeIn] = useState(false); // Added state to control fade-in

  const handlePointerMove = (e: PointerEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const moveHandler = (e: PointerEvent) => handlePointerMove(e);
    document.body.addEventListener('pointermove', moveHandler);
    return () => document.body.removeEventListener('pointermove', moveHandler);
  }, []);

  useEffect(() => {
    const lerpFactor = 0.42;
    lerpPos.current = {
      x: lerp(lerpPos.current.x, pos.x, lerpFactor),
      y: lerp(lerpPos.current.y, pos.y, lerpFactor),
    };
    document.documentElement.style.setProperty('--cursor-x', `${lerpPos.current.x}px`);
    document.documentElement.style.setProperty('--cursor-y', `${lerpPos.current.y}px`);
  }, [pos]);

  const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

  useEffect(() => {
    let frameCount = 0;
    let lastLoop = performance.now();
    const loop = () => {
      const now = performance.now();
      const delta = now - lastLoop;
      frameCount++;
      if (delta >= 1000) {
        setFps(Math.round((frameCount / (delta / 1000))));
        frameCount = 0;
        lastLoop = now;
      }
      requestAnimationFrame(loop);
    };
    loop();
  }, []);

  useEffect(() => {
    if (fps < 60) {
      document.documentElement.classList.add('stop-animation');
    } else {
      document.documentElement.classList.remove('stop-animation');
    }
  }, [fps]);

  // Simulate loading completion after a delay
  useEffect(() => {
    const delay = 2000; // Adjust the delay duration as needed
    const timeout = setTimeout(() => {
      setIsLoaded(true);
      setShouldFadeIn(true);
    }, delay);

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className={`${styles.background} ${shouldFadeIn ? styles.fadeIn : ''}`} />
      <div className={styles.fpsCounter}>{fps} FPS</div>
    </>
  );
};

export default Background;

