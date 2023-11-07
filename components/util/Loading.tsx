import React from 'react';
import styles from './Loading.module.scss';

const Loading = () => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loading}>
                <div className={styles.loadingCircle}></div>
            </div>
        </div>

    );
};

export default Loading;
