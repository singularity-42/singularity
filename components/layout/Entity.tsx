// Entity.tsx
import React from 'react';
import styles from './Entity.module.scss';
import SocialMediaTag, { SocialMedia } from '../content/SocialMedia';
import Markdown from '../content/Markdown';
import Tags from './Tags';
import Gallery from '../content/Gallery';
import HoverLink from '../content/HoverLink';

interface EntityProps {
    entity: any;
    onTagClick?: (tag: string) => void;
    selected?: string[];
}
const Entity: React.FC<EntityProps> = ({ entity, onTagClick, selected }) => {
    if (!entity) {
        return <div>Loading...</div>;
    }

    const { title, instagram, website, tags, soundcloud, spotify, beatport, telegram, adress, location } = entity.metadata;
    const content = entity.content;
    const [lat, long] = location?.split(',').map((s: string) => parseFloat(s)) || [null, null];
    return (
        <div className={styles.entityContainer}>
            {/* {tags && tags.length > 0 && <div>{tags.join(', ')}</div>} */}
            <div className={styles.filterTagsContainer}>
                <Tags tags={tags} onTagClick={onTagClick} selected={selected} />
            </div>
            <div className={styles.detailsContainer}>
                <div className={styles.socialMediaContainer}>
                    <h2 className={styles.title}>{(() => {
                        // title is sometimes a date so we want to display it with . and reorder to day.month.year
                        if (title.includes('-')) {
                            const date = title.split('-');
                            // return `${date[2]}.${date[1]}.${date[0]}`;
                        }
                        return <HoverLink name={title}>{title}</HoverLink>;

                    })()}</h2>
                </div>
                <div className={styles.galleryContainer}>
                    <Gallery images={entity.images} name={title} />
                </div>
                {/* {website && <a href={website} className={styles.socialMediaLink}> {website} </a>} */}
            </div>

            <div className={styles.contentContainer}>
                {content && <Markdown content={content} />}
            </div>
            
            <div className={styles.tagsContainer}>
                {website && <SocialMediaTag socialMedia={SocialMedia.Website} username={website} />}
                {spotify && <SocialMediaTag socialMedia={SocialMedia.Spotify} username={spotify} />}
                {beatport && <SocialMediaTag socialMedia={SocialMedia.Beatport} username={beatport} />}
                {telegram && <SocialMediaTag socialMedia={SocialMedia.Telegram} username={telegram} />}
                {soundcloud && <SocialMediaTag socialMedia={SocialMedia.SoundCloud} username={soundcloud} />}
                {instagram && <SocialMediaTag socialMedia={SocialMedia.Instagram} username={instagram} />}
            </div>
        </div>
    );
};

export default Entity;
