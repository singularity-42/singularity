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
        <div className={`${styles.popup} ${isPopupVisible ? styles.show : styles.hide}`}>
            {/* Rest of your component remains the same */}
        </div>
    );
};

export default Entity;