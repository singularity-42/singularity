import React from 'react';
import styles from './Socials.module.scss';
import SocialMediaTag, { SocialMedia } from '../../base/SocialMedia';

interface ListSocialsProps {
    metadata?: any;
}

const Socials: React.FC<ListSocialsProps> = ({ metadata = {} }) => {
    return <div className={styles.listSocials}>
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
export default Socials;
