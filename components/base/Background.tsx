import React, { useState, useEffect, useRef } from 'react';
import styles from './Background.module.scss';

const Background = () => {
 const [pos, setPos] = useState({ x: 0, y: 0 });
 const lerpPos = useRef({ x: 0, y: 0 });
 const [fps, setFps] = useState(60);
 const [isLoaded, setIsLoaded] = useState(false);
 const [shouldFadeIn, setShouldFadeIn] = useState(false);
 const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
 const cursorStyleRef = useRef<HTMLDivElement>(null);

 const handlePointerMove = (e: PointerEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setTargetPos({ x: e.clientX, y: e.clientY });
 };

 useEffect(() => {
    const moveHandler = (e: PointerEvent) => handlePointerMove(e);
    document.body.addEventListener('pointermove', moveHandler);
    return () => document.body.removeEventListener('pointermove', moveHandler);
 }, []);

 useEffect(() => {
    const intervalId = setInterval(() => {
      setTargetPos((prevTargetPos) => ({
        x: prevTargetPos.x + (pos.x - prevTargetPos.x) * 0.1,
        y: prevTargetPos.y + (pos.y - prevTargetPos.y) * 0.1,
      }));
    }, 1000 / fps);

    return () => clearInterval(intervalId);
 }, [fps, pos]);

 useEffect(() => {
    const lerpFactor = 0.1;
    lerpPos.current = {
      x: Math.round(((lerpPos.current.x + (targetPos.x - lerpPos.current.x) * lerpFactor) * 10000) / 10000),
      y: Math.round(((lerpPos.current.y + (targetPos.y - lerpPos.current.y) * lerpFactor) * 10000) / 10000),
    };
    if (cursorStyleRef?.current)
      cursorStyleRef.current.style.setProperty('--cursor-x', `${lerpPos.current.x}px`);
    cursorStyleRef?.current?.style.setProperty('--cursor-y', `${lerpPos.current.y}px`);
 }, [targetPos]);

 useEffect(() => {
    let frameCount = 0;
    let lastLoop = performance.now();
    const loop = () => {
      const now = performance.now();
      const delta = now - lastLoop;
      frameCount++;
      if (delta >= 1000) {
        frameCount = 0;
        lastLoop = now;
      }
      requestAnimationFrame(loop);
    };
    loop();
 }, []);

 useEffect(() => {
    const delay = 2000;
    const timeout = setTimeout(() => {
      setIsLoaded(true);
      setShouldFadeIn(true);
    }, delay);
    return () => clearTimeout(timeout);
 }, []);

 return (
    <>
      <div className={`${styles.background} ${shouldFadeIn ? styles.fadeIn : ''}`} ref={cursorStyleRef} />
    </>
 );
};

export default Background;
