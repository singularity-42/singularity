"use client"

import React, { useEffect, useState } from 'react';
import styles from './Details.module.scss';
import Markdown from '../content/Markdown';
import Tags from './Tags';
import Map from '../content/Map';
import useEntity from '@/hooks/useEntity';
import ListSocials from './ListSocials';
import Graph from '../content/Graph';
import { useDetails } from '@/hooks/provider/DetailsProvider';
import useRelation from '@/hooks/useRelations';

interface EntityProps {
}

const Details: React.FC<EntityProps> = ({ }) => {
    const { name, setName, visible, toggleVisibility } = useDetails();

    const { relations } = useRelation(name);
    const { entity, loading, error } = useEntity(name);
    useEffect(() => {
        if (name) {
            if (!visible)
                toggleVisibility();
        }
    }, [name]);

    useEffect(() => {
        const hash = window.location.hash;
        let decodedUrlHash = decodeURIComponent(hash).replace('#', '');
        setName(decodedUrlHash);
    }, []);

    const handleExit = () => {
        if ( visible ) 
            toggleVisibility();
    };

    if (!visible) return null;
    if (loading) return null;


    return (
        <div className={`${styles.popup} ${visible ? styles.show : styles.hide}`}>
            <button className={styles.closeButton} onClick={handleExit}>X</button>
            <div className={styles.detailsContainer}>
                <h2 className={styles.title}>{entity.title.split('\\').pop()}</h2>
            </div>
            <div className={styles.tagsContainer}>
                <Tags tags={entity.tags} />
            </div>
            <div className={styles.socialMediaContainer}>
                <ListSocials metadata={entity} />
            </div>
            {/* {entity.address && <div className={styles.addressContainer}>{entity.address}</div>} */}
            {entity.description && <Markdown content={entity.description} active={true} />}
            { relations && <Graph graphData={relations} />}
            {entity.location && <Map location={entity.location} />}
        </div>
    );
};

export default Details;