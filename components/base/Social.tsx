import React from 'react';
import { IconContext } from 'react-icons';

import styles from './Social.module.scss';
import { SOCIAL_MEDIA_ICONS, SocialMedia } from '@/app/defaults';


interface SocialMediaTagProps {
    socialMedia: SocialMedia;
    username: string;
    onClick?: (e: React.MouseEvent) => void;
}

const Social: React.FC<SocialMediaTagProps> = ({ socialMedia, username, onClick }) => {
    if (!username) return null;

    const Icon = SOCIAL_MEDIA_ICONS[socialMedia];
    if (!Icon) return null;

    const url = username.startsWith('http') || username.startsWith('www')
        ? username
        : `https://www.${socialMedia}.com/${username}`;

    const handleSocialMediaClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (onClick)
            onClick(e);
        else
            window.open(url);
    };

    return (
        <IconContext.Provider value={{ size: '2rem' }}>
            <div className={styles.socialMediaTag} onClick={handleSocialMediaClick}>
                {Icon}
            </div>
        </IconContext.Provider>
    );
};

export default Social;
