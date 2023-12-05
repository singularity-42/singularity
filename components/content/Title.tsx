import React from 'react';
import Link from 'next/link';
import styles from './Title.module.scss';

const Title = () => {
    return (
        <Link href="/" className={styles.title}>Singularity</Link>
    )
}

export default Title;