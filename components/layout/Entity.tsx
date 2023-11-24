// Entity.tsx
import React from 'react';
import styles from './Entity.module.scss';
import SocialMediaTag, { SocialMedia } from '../content/SocialMedia';
import Markdown from '../content/Markdown';
import Tags from './Tags';
import Gallery from '../content/Gallery';

interface EntityProps {
    entity: any;
    onTagClick?: (tag: string) => void;
    selected?: string[];
}
const Entity: React.FC<EntityProps> = ({ entity, onTagClick, selected }) => {
    if (!entity) {
        return <div>Loading...</div>;
    }

    const { title, instagram, website, tags, soundcloud, spotify, beatport, telegram } = entity.metadata;
    const content = entity.content;

    return (
        <div className={styles.entityContainer}>
            {/* {tags && tags.length > 0 && <div>{tags.join(', ')}</div>} */}
            <div className={styles.detailsContainer}>
                <div className={styles.socialMediaContainer}>
                    <h2 className={styles.title}>{(() => { 
                        // title is sometimes a date so we want to display it with . and reorder to day.month.year
                        if(title.includes('-')) {
                            const date = title.split('-');
                            return `${date[2]}.${date[1]}.${date[0]}`;
                        }
                        return title 
                    })() }</h2>
                    {website && <SocialMediaTag socialMedia={SocialMedia.Website} username={website} />}
                    {instagram && <SocialMediaTag socialMedia={SocialMedia.Instagram} username={instagram} />}
                    {soundcloud && <SocialMediaTag socialMedia={SocialMedia.SoundCloud} username={soundcloud} />}
                    {spotify && <SocialMediaTag socialMedia={SocialMedia.Spotify} username={spotify} />}
                    {beatport && <SocialMediaTag socialMedia={SocialMedia.Beatport} username={beatport} />}
                    {telegram && <SocialMediaTag socialMedia={SocialMedia.Telegram} username={telegram} />}
                    <div className={styles.tagsContainer}>
                        <Tags tags={tags} onTagClick={onTagClick} selected={selected} />
                    </div>
                </div>
                {/* {website && <a href={website} className={styles.socialMediaLink}> {website} </a>} */}
            </div>
          
          
            {content.length > 10 &&
                <div className={styles.entityMarkdown}>
                    <Markdown content={content} />
                </div>}
        </div>
    );
};

export default Entity;
