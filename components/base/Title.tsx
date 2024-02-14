import React from 'react';
import Link from 'next/link';
import styles from './Title.module.scss';

interface TitleProps {
    onClick?: () => void;
}

const Title: React.FC<TitleProps> = ({ onClick }) => {
    return (
        <div onClick={onClick} className={styles.container}>
            <Link href="/" className={styles.title}>
                Singularity
            </Link>
        </div>
    );
};

export default Title;
