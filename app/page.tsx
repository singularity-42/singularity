"use client"
// path: app/page.tsx
import styles from '@/styles/Home.module.scss'
import Loading from '@/components/util/view/Loading'

import { Canvas } from '@react-three/fiber';
import BlackHole from '@/components/util/view/BlackHole'

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
