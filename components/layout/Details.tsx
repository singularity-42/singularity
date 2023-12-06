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
import { MdClose } from 'react-icons/md';
import SpotifyTrack from '../content/SpotifyTrack';

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

    useEffect(() => {
        if (name) {
            const encodedUrlHash = encodeURIComponent(name);
            window.location.hash = encodedUrlHash;
        }
    }, [name]);

    const handleExit = () => {
        if (visible)
            toggleVisibility();
    };

    if (!visible) return null;
    if (loading) return null;

    const { metadata } = entity as any;


    return (
        <div className={`${styles.popup} ${visible ? styles.show : styles.hide}`}>
            <button className={styles.closeButton} onClick={handleExit}>
                {/** react icons x or close icons */}
                <MdClose />
            </button>
            <div className={styles.contentContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.detailsContainer}>
                        <h2 className={styles.title}>{entity.title.split(/\\|\//).pop()}</h2>
                    </div>
                    <div className={styles.tagsContainer}>
                        <Tags tags={entity.tags} />
                    </div>
                    <div className={styles.socialMediaContainer}>
                        <ListSocials metadata={entity} />
                    </div>
                        <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0xWjH1Z0Fv43ZB0dGvZa1v?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    {metadata && metadata.spotiytrack && <div className={styles.spotifyContainer}>
                        {metadata.spotifytrack}
                        <SpotifyTrack track={metadata.spotiytrack} />
                    </div>}
                    {entity.description && <Markdown content={entity.description} active={true} />}
                    {/* {entity.address && <div className={styles.addressContainer}>{entity.address}</div>} */}
                </div>
                {relations && relations.edges.length > 1 ? <Graph graphData={relations} /> : null}
            </div>
            <div className={styles.mapContainer}>
            {entity.location && <Map location={entity.location} />}
            </div>
        </div>
    );
};

export default Details;