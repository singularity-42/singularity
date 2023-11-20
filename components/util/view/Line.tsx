import React, { useEffect, useRef } from 'react';

interface LineProps {
 start: [number, number],
 end: [number, number],
 color: string,
 offset: [number, number],
}

const Line: React.FC<LineProps> = ({ start, end, color, offset }) => {
 const ref = useRef<HTMLDivElement | null>(null);

 useEffect(() => {
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect();
    const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
    const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) * 180 / Math.PI;
    ref.current.style.width = `${length}px`;
    ref.current.style.transform = `rotate(${angle}deg)`;
    ref.current.style.transformOrigin = `${start[0] - rect.left - offset[0]}px ${start[1] - rect.top - offset[1]}px`;
  }
 }, [start, end, offset]);

 return (
  <div ref={ref} style={{
    position: 'absolute',
    height: '2px',
    backgroundColor: color,
  }} />
 );
};

export default Line;
