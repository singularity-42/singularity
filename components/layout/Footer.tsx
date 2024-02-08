import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Footer.module.scss';

const Footer: React.FC = () => {
  const config = [
    {
      href: '',
      alt: 'patreon',
      src: '/icons/artist/patreon.svg',
    },
    {
      href: '',
      alt: 'spotify',
      src: '/icons/artist/spotify.svg',
    },
    {
      href: '',
      alt: 'soundcloud',
      src: '/icons/artist/soundcloud.svg',
    },
    {
      href: '',
      alt: 'youtube',
      src: '/icons/artist/youtube.svg',
    },
    {
      href: '',
      alt: 'instagram',
      src: '/icons/artist/instagram.svg',
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__left}>
        {config.map((item, index) => (
          <a href={item.href} key={index} className={styles.link}>
            <button className={styles.button}>
              <Image src={item.src} alt={item.alt} width={20} height={20} />
            </button>
          </a>
        ))}
      </div>
      <div className={styles.footer__right}>
        <p>© 2023 Drumnicorn</p>
      </div>
    </footer>
  );
};

export default Footer;
