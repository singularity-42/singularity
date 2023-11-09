// path: app/page.tsx

import Image from 'next/image'
import styles from '@/styles/Home.module.scss'
import Header from '@/components/base/Header'
import { SessionProvider } from 'next-auth/react'

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <SessionProvider session={null}>*/}
      {/* </SessionProvider> */}
    </main>
  )
}
