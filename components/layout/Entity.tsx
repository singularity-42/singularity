// Entity.tsx
import React from 'react';
import styles from './Entity.module.scss';
import Markdown from '../content/Markdown';
import Tags from './Tags';
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
    const [isHovered, setIsHovered] = React.useState(false); // State to track hover


    const { title, tags } = entity.metadata;
    const content = entity.content;
    return (
        <div
            className={styles.entityContainer}
            onMouseEnter={() => setIsHovered(true)} // Set isHovered to true on mouse enter
            onMouseLeave={() => setIsHovered(false)} // Set isHovered to false on mouse leave
        >
            <div className={styles.socialMediaContainer}>
                <h2 className={styles.title}>{(() => {
                    // title is sometimes a date so we want to display it with . and reorder to day.month.year
                    if (title.includes('-')) {
                        const date = title.split('-');
                        // if there is time also display 
                        if (date.length == 6)
                            return <HoverLink name={title}>{`${date[2]}.${date[1]}.${date[0]} ${date[3]}:${date[4]}:${date[5]}`}</HoverLink>;
                        return <HoverLink name={title}>{`${date[2]}.${date[1]}.${date[0]}`}</HoverLink>;
                        // return `${date[2]}.${date[1]}.${date[0]}`;
                    }
                    return <HoverLink name={title}>{title}</HoverLink>;

                })()}</h2>
                <Tags tags={tags} onTagClick={onTagClick} selected={selected} />
            </div>

            {
                entity.metadata.original && <div className={styles.original}>
                    ORIGINAL: <HoverLink name={entity.metadata.original.replaceAll('[', '').replaceAll(']', '').replaceAll('"', '')}> {entity.metadata.original.replaceAll('[', '').replaceAll(']', '').replaceAll('"', '')} </HoverLink>
                </div>
            }

            {/* <div className={styles.filterTagsContainer}>
                <SocialMedias metadata={entity.metadata} />
            </div>
            <div className={styles.detailsContainer}>
                <div className={styles.galleryContainer}>
                    <Gallery images={entity.images} name={title} />
                </div>
            </div>
            */}
            <div className={styles.contentContainer}>
                {content.length > 4.2 && ( // @TODO: fix this and find a better way to check if there is content
                    <Markdown content={content} active={isHovered} /> 
                )}
            </div> 

         
        </div>
    );
};

export default Entity;
