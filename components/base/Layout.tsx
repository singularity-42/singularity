"use client";

import styles from './Layout.module.scss';
// import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';
import { SessionProvider } from 'next-auth/react';
import useTheme from '@/util/styles/theme';

// const Scene: any = dynamic(() => import('@/components/scene/Scene'), {
//   ssr: false,
// });
const Layout = ({ children }: any) => {
  const { theme, themeToggler } = useTheme();

  return (
    <div className={styles.layoutContainer}>
      <SessionProvider>
        <div className={styles.themeContext}>
          <div className={`${styles.app}`}>
            <div className={styles.headerWrapper}>
              <Header themeToggler={themeToggler} theme={theme} />
            </div>
            <div className={styles.contentWrapper}>
              <div className={styles.content}>
                {children}
              </div>
            </div>
            <div className={styles.footerWrapper}>
              <Footer />
            </div>
          </div>
          {/* <div className={styles.sceneWrapper}>
              <Scene eventSource={ref} eventPrefix="client" />
            </div> */}
        </div>
      </SessionProvider>
    </div>
  );
};

export { Layout };