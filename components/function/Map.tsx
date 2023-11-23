
import React from 'react';

import styles from '@/styles/Map.module.scss';

// public/icons/map-filled.svg
// public/icons/map.svg

export default function Map() {
    return (
        <div className={styles.map}>
            <div className={styles.mapContainer}>
                <div className={styles.mapImage}>
                    <img src="/icons/map-filled.svg" alt="map" />
                </div>
            </div>
        </div>
    );
};


