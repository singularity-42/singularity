import React from 'react';
import styles from '../../styles/Entity.module.scss';
import ImageGallery from '../util/view/ImageGallery';
import SocialMediaTag, { SocialMedia } from '../util/view/SocialMediaTag';
import TagBubble from '../util/view/TagBubble';


interface EntityProps {
    entity: any;
}

const Entity: React.FC<EntityProps> = ({ entity }) => {
    if (!entity) {
        return <div>Loading...</div>;
    }

    if (!entity) {
        return <div>Loading...</div>;
    }


    const { title, instagram, website, tags } = entity.metadata;
    const content = entity.content;

    // Assuming images is an array of image URLs from Instagram

    return (
        <div className={styles.entityContainer}>
            <TagBubble tags={tags || []} />
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.entityWebsite}>&nbsp;</div>
            <ImageGallery images={[]} name={title} />
            <div className={styles.detailsContainer}>
                <div className={styles.infoContainer}>
                    <SocialMediaTag socialMedia={SocialMedia.Instagram} username={instagram} />
                </div></div>
        </div>
    );
};

export default Entity;
