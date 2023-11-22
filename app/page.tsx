"use client"
// path: app/page.tsx
import styles from './page.module.scss'
import Loading from '@/components/design/Loading'

import { Canvas } from '@react-three/fiber';
import BlackHole from '@/components/design/BlackHole'

export default function Home() {
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
