import React from 'react';
import styles from './Entity.module.scss';
import SocialMediaTag, { SocialMedia } from '../content/SocialMedia';

interface SocialMediasProps {
    metadata: any;
}

const SocialMedias: React.FC<SocialMediasProps> = ({ metadata }) => {
    return <div className={styles.tagsContainer}>
        {
            Object.keys(metadata).map((key) => {
                if (Object.values(SocialMedia).includes(key as SocialMedia)) {
                    return <SocialMediaTag socialMedia={key as SocialMedia} username={metadata[key]} />;
                }
            }
            )

        }
    </div>;
}
export default SocialMedias;
