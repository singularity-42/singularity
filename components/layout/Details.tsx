// Entity.tsx
import React, { use } from 'react';
import styles from './Details.module.scss';
import SocialMediaTag, { SocialMedia } from '../content/SocialMedia';
import Markdown from '../content/Markdown';
import Tags from './Tags';
import Map from '../content/Map';
import useEntity from '@/hooks/useEntity';
import SocialMedias from './SocialMedias';

interface EntityProps {
}
const Entity: React.FC<EntityProps> = () => {
    // {url}#{name}

    const url = window.location.href;
    const name = url.split('#')[1];
    if (!name) {
        return;
    }
    const name2 = name.replace('-', ' ');
    const entity = useEntity(name2);

    // const entity = useEntity(name);
    
    if (!entity) {
        return <div>Loading...</div>;
    }

    const { title, instagram, website, tags, soundcloud, spotify, beatport, telegram, adress, location } = entity;
    const [lat, long] = location?.split(',').map((s: string) => parseFloat(s)) || [null, null];
    return (
        <div className={styles.popup}>
            <div className={styles.closeButton}>
                <a href="">&times;</a>
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

            {adress && <div className={styles.adressContainer}> {adress} </div>}

            <Map />

            <div className={styles.descriptionContainer}>
                <Markdown content={entity.description || ''} />
            </div>

        </div>
    );
};

export default Entity;
