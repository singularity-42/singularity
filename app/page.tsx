// path: app/page.tsx

import Image from 'next/image'
import styles from '@/styles/Home.module.scss'
import Header from '@/components/base/Header'
import { SessionProvider } from 'next-auth/react'
import Loading from '@/components/util/view/Loading'

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <SessionProvider session={null}>*/}
      {/* </SessionProvider> */}

    <Loading />
    </main>
  )
}
