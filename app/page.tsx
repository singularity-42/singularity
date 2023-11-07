import Image from 'next/image'
import styles from './page.module.css'
import Header from '@/components/base/Header'
import { SessionProvider } from 'next-auth/react'

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <SessionProvider session={null}>*/}
        <Header /> 
      {/* </SessionProvider> */}
    </main>
  )
}
