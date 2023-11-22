
import React from 'react';
import Icon from "../../base/Icon";

import styles from '@/styles/Map.module.scss';

export default function Map() {
    return (
        <div className={styles.map}>
            <div className={styles.mapContainer}>
                <Icon name="map" size={32} />
            </div>
        </div>
    );
};


