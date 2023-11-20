import React from 'react';
import styles from '../../styles/Entity.module.scss';
import TagBubbleList from './TagBubble';
import Markdown from '../util/view/Markdown';

interface ImageGalleryProps {
    images: string[];
    name: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, name }) => {
    return (
        <div className={styles.imageGallery}>
            <div className={styles.largeImageContainer}>
                <img src={images[0]} alt={name} className={styles.largeImage} />
            </div>
            <div className={styles.smallImagesContainer}>
                {images.slice(1, 4).map((image, index) => (
                    <img key={index} src={image} alt={name} className={styles.smallImage} />
                ))}
            </div>
        </div>
    );
};

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
    const images = [
        "https://scontent-fra5-2.cdninstagram.com/v/t51.2885-19/311902218_1165966927367757_3440204424326455679_n.jpg"
    ]; // Replace this with the actual array of image URLs

    return (
        <div className={styles.entityContainer}>
            <TagBubbleList tags={tags || []} />
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.entityWebsite}>&nbsp;</div>
            @<ImageGallery images={images} name={title} />
            <div className={styles.detailsContainer}>
                <div className={styles.infoContainer}>
                    <div className={styles.instagram}></div>
                </div></div>
        </div>
    );
};

export default Entity;
