import React, { useEffect, useState } from 'react';
import styles from './Details.module.scss';
import Markdown from '../content/Markdown';
import Tags from './Tags';
import Map from '../content/Map';
import useEntity from '@/hooks/useEntity';
import SocialList from './SocialList';
import Graph from '../content/Graph';

interface EntityProps {
    name: string;
}

const Entity: React.FC<EntityProps> = ({ name }) => {
    const [entity, setEntity] = useState<any>(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false); // Start with the popup hidden

    useEffect(() => {
        if (!name) return;

        const name2 = name.replace('-', ' ');
        const fetchedEntity = useEntity(name2);

        if (fetchedEntity) {
            setEntity(fetchedEntity);
            setIsPopupVisible(true); // Set popup visibility if entity is fetched successfully
        } else {
            setIsPopupVisible(false); // Hide popup if entity is not found
        }
    }, [name]);

    const handleExit = () => {
        setIsPopupVisible(false);
        window.history.pushState('', document.title, window.location.href.split('#')[0]);
    };

    // if (!entity) {
    //     return <div>Entity not found</div>;
    // }

    return (
        <div className={`${styles.popup} ${visible ? styles.show : styles.hide}`}>
            <button className={styles.closeButton} onClick={handleExit}>X</button>
            <div className={styles.detailsContainer}>
                <h2 className={styles.title}>{entity.title.
            </div>
            <div className={styles.tagsContainer}>
                <Tags tags={entity.tags} />
            </div>
            <div className={styles.socialMediaContainer}>
                <SocialList metadata={entity} />
            </div>
            {/* {entity.address && <div className={styles.addressContainer}>{entity.address}</div>} */}
            {entity.description && <Markdown content={entity.description} active={true} />}
            { relations && <Graph graphData={relations} />}
            {entity.location && <Map location={entity.location} />}
        </div>
    );
};

export default Entity;