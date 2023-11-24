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
    const { title, instagram, website, tags, soundcloud, spotify, beatport, telegram, address, location, description } = entity;

    return (
        <div className={styles.popup}>
            <div className={styles.closeButton}>
                <Link href={origin}> <a> X </a> </Link>  
            </div>
            <div className={styles.detailsContainer}>
                <div className={styles.socialMediaContainer}>
                    <h2 className={styles.title}>{(() => {
                        if (title.includes('-')) {
                            const date = title.split('-');
                            return `${date[2]}.${date[1]}.${date[0]}`;
                        }
                        return title
                    })()}</h2>
                </div>
                    <div className={styles.tagsContainer}>
                        <Tags tags={tags} />
                    </div>
                    <SocialMedias website={website} spotify={spotify} beatport={beatport} telegram={telegram} soundcloud={soundcloud} instagram={instagram} />
            </div>

            {address && <div className={styles.adressContainer}> {address} </div>}
{/*                 
            <Graph graphData={
                {
                    nodes: [
                        { id: 'node1', fx: 100, fy: 100 },
                        { id: 'node2', fx: 200, fy: 200 },
                    ],
                    links: [
                        { source: 'node1', target: 'node2' },
                    ],
                }
            } /> */}

            <Map location={location} />
            <Markdown content={description} />
        </div>
    );
};

export default Entity;
