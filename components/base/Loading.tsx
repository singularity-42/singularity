import React from 'react';
import styles from './Loading.module.scss';

const Loading = () => {
    return (
        <div className={styles.loadingContainer}>
            <img src="/singularity.png" alt="42" className={styles.faviconRotating} />
        </div>
    );
};

export default Loading;
