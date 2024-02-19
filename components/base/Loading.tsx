import React, { useEffect, useState } from 'react';
import styles from './Loading.module.scss';
import Image from 'next/image';

interface LoadingProps {
  loading?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading = true }) => {
  const [showLoading, setShowLoading] = useState(loading);

  useEffect(() => {
    // When the loading prop changes, update the showLoading state after a short delay
    const timeout = setTimeout(() => {
      setShowLoading(loading);
    }, 200); // Adjust the delay as needed

    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <div className={`${styles.loadingContainer} ${showLoading ? styles.show : ''}`}>
      <Image src="/singularity.png" alt="42" className={styles.faviconRotating} width={500} height={500} priority  />
    </div>
  );
};

export default Loading;
