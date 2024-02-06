import React from 'react';
import styles from './Loading.module.scss';

const Loading = () => {
    return (
        <div className={styles.loadingContainer}>
            <img src="/Logo.png" alt="Favicon" className={styles.faviconRotating} />
        </div>
    );
};

export default Loading;
