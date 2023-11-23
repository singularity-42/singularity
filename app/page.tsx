"use client"
// path: app/page.tsx
import styles from './page.module.scss'
import Loading from '@/components/content/Loading'

import { Canvas } from '@react-three/fiber';
import BlackHole from '@/components/content/BlackHole'
import { useTooltip } from '@/hooks/provider/TooltipProvider';
import { useEffect } from 'react';

export default function Home() {

  const {setTooltip} = useTooltip();

  useEffect(() => {
    setTooltip(`Welcome - to Singularity!`);
  }, []);

  return (
    <main className={styles.main}>
      {/* <SessionProvider session={null}>*/}
      {/* </SessionProvider> */}
      <Canvas className={styles.canvas}>
        <BlackHole />
      </Canvas>

      <Loading />
    </main>
  )
}
