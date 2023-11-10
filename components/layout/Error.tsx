import React from 'react';
import styles from '@/styles/Error.module.scss';

interface ErrorDisplayProps {
    error: string;
    onClick: () => void;
}

const Error: React.FC<ErrorDisplayProps> = ({ error, onClick }) => {
    return (
        <div className={styles.errorDisplay}>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.closeButton} onClick={() => onClick()}>
                <span className={styles.closeIcon}>&times;</span>
            </button>
        </div>
    );
};

export default Error;
