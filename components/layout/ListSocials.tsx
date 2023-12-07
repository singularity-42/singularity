import React from 'react';
import styles from './ListSocials.module.scss';
import SocialMediaTag, { SocialMedia } from '../content/SocialMedia';

interface ListSocialsProps {
    metadata: any;
}

const ListSocials: React.FC<ListSocialsProps> = ({ metadata }) => {
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
export default ListSocials;
