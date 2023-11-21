// Entity.tsx
import React from 'react';
import styles from '../../styles/Entity.module.scss';
import SocialMediaTag, { SocialMedia } from '../util/view/SocialMediaTag';
import Markdown from '../util/view/Markdown';
import TagBubbleList from '../util/view/TagBubble';

interface EntityProps {
    entity: any;
    onTagClick?: (tag: string) => void;
}

const Entity: React.FC<EntityProps> = ({ entity, onTagClick }) => {
    if (!entity) {
        return <div>Loading...</div>;
    }

    const { title, instagram, website, tags, soundcloud, spotify, beatport } = entity.metadata;
    const content = entity.content;

    return (
        <div className={styles.entityContainer}>
            <div className={styles.tagsContainer}>
                <TagBubbleList tags={tags} onTagClick={onTagClick} />
            </div>
            {/* {tags && tags.length > 0 && <div>{tags.join(', ')}</div>} */}
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.detailsContainer}>
                <div className={styles.socialMediaContainer}>
                    {instagram && <SocialMediaTag socialMedia={SocialMedia.Instagram} username={instagram} />}
                    {soundcloud && <SocialMediaTag socialMedia={SocialMedia.SoundCloud} username={soundcloud} />}
                    {spotify && <SocialMediaTag socialMedia={SocialMedia.Spotify} username={spotify} />}
                    {beatport && <SocialMediaTag socialMedia={SocialMedia.Beatport} username={beatport} />}
                </div>
                {website && <a href={website} target="_blank" rel="noopener noreferrer" className={styles.socialMediaLink}> {website} </a>}
            </div>
            <div className={styles.entityMarkdown}>
                <Markdown content={content} />
            </div>
        </div>
    );
};

export default Entity;
