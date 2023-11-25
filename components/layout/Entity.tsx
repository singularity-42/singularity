// Entity.tsx
import React from 'react';
import styles from './Entity.module.scss';
import SocialMediaTag, { SocialMedia } from '../content/SocialMedia';
import Markdown from '../content/Markdown';
import Tags from './Tags';
import Gallery from '../content/Gallery';
import HoverLink from '../content/HoverLink';
import SocialMedias from './SocialList';

interface EntityProps {
    entity: any;
    onTagClick?: (tag: string) => void;
    selected?: string[];
}
const Entity: React.FC<EntityProps> = ({ entity, onTagClick, selected }) => {
    if (!entity) {
        return <div>Loading...</div>;
    }
    const [isHovered, setIsHovered] = React.useState(false); // State to track hover


    const { title, instagram, website, tags, soundcloud, spotify, beatport, telegram, address, location } = entity.metadata;
    const content = entity.content;
    const [lat, long] = location?.split(',').map((s: string) => parseFloat(s)) || [null, null];
    return (
        <div
            className={styles.entityContainer}
            onMouseEnter={() => setIsHovered(true)} // Set isHovered to true on mouse enter
            onMouseLeave={() => setIsHovered(false)} // Set isHovered to false on mouse leave
        >
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
                {content.length > 4.2 && ( // Check if content length meets the condition
                    <Markdown content={content} active={isHovered} /> // Pass active prop based on hover state
                )}
            </div>

            <SocialMedias metadata={entity.metadata} />
        </div>
    );
};

export default Entity;
