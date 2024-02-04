"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './Background.module.scss';

const Background = () => {
 const [pos, setPos] = useState({ x: 0, y: 0 });
 const lerpPos = useRef({ x: 0, y: 0 });

 const handlePointerMove = (e: PointerEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
 };

 useEffect(() => {
    document.body.addEventListener('pointermove', handlePointerMove);

    return () => {
      document.body.removeEventListener('pointermove', handlePointerMove);
    };
 }, []);

 useEffect(() => {
    const lerpFactor = 0.1;

    lerpPos.current = {
      x: lerp(lerpPos.current.x, pos.x, lerpFactor),
      y: lerp(lerpPos.current.y, pos.y, lerpFactor),
    };

    document.documentElement.style.setProperty('--cursor-x', `${lerpPos.current.x}px`);
    document.documentElement.style.setProperty('--cursor-y', `${lerpPos.current.y}px`);
 }, [pos]);

 const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t;
 };

 return <div className={styles.background} />;
};

export default Background;
