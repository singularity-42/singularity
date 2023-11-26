import React from 'react';
import Link from 'next/link';
import styles from './Brand.module.scss';

const Brand = () => {
    return (
        <Link href="/" className={styles.brand}>Singularity</Link>
    )
}

export default Brand;