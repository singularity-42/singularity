// Entity.tsx
import React, { use, useEffect, useState } from 'react';
import styles from './Details.module.scss';
import SocialMediaTag, { SocialMedia } from '../content/SocialMedia';
import Markdown from '../content/Markdown';
import Tags from './Tags';
import Map from '../content/Map';
import useEntity from '@/hooks/useEntity';
import SocialMedias from './SocialMedias';
import Graph from '../content/Graph';
import Link from 'next/link';

interface EntityProps {
}
const Entity: React.FC<EntityProps> = () => {
    // {url}#{name}

    const url = window.location.href;
    const origin = url.split('#')[0];
    const name = url.split('#')[1];
    if (!name) {
        return;
    }
    const name2 = name.replace('-', ' ');
    const entity = useEntity(name2);

    if (!entity) {
        return 
    }

    const handleExit = () => {

        window.history.back();

    }

    return (
        <div className={styles.popup}>
            <div className={styles.closeButton}>
                <div onClick={() =>handleExit()}>X</div>  
            </div>
            <div className={styles.detailsContainer}>
                    <h2 className={styles.title}>{(() => {
                        if (entity.title.includes('-')) {
                            const date = entity.title.split('-');
                            return `${date[2]}.${date[1]}.${date[0]}`;
                        }
                        return entity.title
                    })()}</h2>
                    <div className={styles.tagsContainer}>
                        <Tags tags={entity.tags} />
                    </div>
                    <div className={styles.socialMediaContainer}>
                        <SocialMedias metadata={entity} />
                    </div>
            </div>
            {entity.address && <div className={styles.addressContainer}> {entity.address} </div>}
            {entity.location && <Map location={entity.location} />}
            {entity.description && <Markdown content={entity.description} active={true} />}
        </div>
    );
};

export default Entity;
