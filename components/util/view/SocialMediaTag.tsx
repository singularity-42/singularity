
// social media tag has enum for all social media types and a  value for the username

import React from 'react';
import styles from '@/styles/SocialMediaTag.module.scss';

export enum SocialMedia {
    Instagram = 'Instagram',
    YouTube = 'YouTube',
    SoundCloud = 'SoundCloud',
    Spotify = 'Spotify',
    AppleMusic = 'AppleMusic',
    Bandcamp = 'Bandcamp',
    Twitch = 'Twitch',
    Beatport = 'Beatport'
}

interface SocialMediaTagProps {
    socialMedia: SocialMedia;
    username: string;
}

const SocialMediaTag: React.FC<SocialMediaTagProps> = ({ socialMedia, username }) => {
    if (!username) {
        return null;
    }
    return (
        <div className={styles.socialMediaTag + ' ' + styles[socialMedia]}>
            <div className={styles.socialMediaIcon}>&nbsp;</div>
            <div className={styles.username}>@{username}</div>
        </div>
    );
};

export default SocialMediaTag;

