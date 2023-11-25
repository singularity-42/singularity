import React from 'react';
import styles from './SocialList.module.scss';
import SocialMediaTag, { SocialMedia } from '../content/SocialMedia';

interface SocialListProps {
    metadata: any;
}

const SocialList: React.FC<SocialListProps> = ({ metadata }) => {
    return <div className={styles.socialList}>
        {
            Object.keys(metadata).map((key, index) => {
                if (Object.values(SocialMedia).includes(key as SocialMedia)) {
                    return <SocialMediaTag 
                    key={`${index}`} 
                    socialMedia={key as SocialMedia} username={metadata[key]} />;
                }
            }
            )
        }
    </div>;
}
export default SocialList;
