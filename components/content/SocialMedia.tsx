
// social media tag has enum for all social media types and a  value for the username

import React from 'react';
import styles from './SocialMedia.module.scss';

export enum SocialMedia {
    Website = 'Website',
    Instagram = 'Instagram',
    YouTube = 'YouTube',
    SoundCloud = 'SoundCloud',
    Spotify = 'Spotify',
    Beatport = 'Beatport',
    Telegram = 'Telegram',
}

enum SocialMediaUrl {
    Website = 'https://',
    Instagram = 'https://www.instagram.com/',
    YouTube = 'https://www.youtube.com/@',
    SoundCloud = 'https://soundcloud.com/',
    Spotify = 'https://open.spotify.com/artist/',
    Beatport = 'https://www.beatport.com/artist/',
    Telegram = 'https://t.me/',
}

enum SocialMediaIcon {
    Website = '/icons/socials/website',
    Instagram = '/icons/socials/instagram',
    YouTube = '/icons/socials/youtube',
    SoundCloud = '/icons/socials/soundcloud',
    Spotify = '/icons/socials/spotify',
    Beatport = '/icons/socials/headphones',
    Telegram = '/icons/socials/telegram'
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
            <a href={SocialMediaUrl[socialMedia] + username} target="_blank" rel="noopener noreferrer"><div className={styles.socialMediaIcon}><img src={SocialMediaIcon[socialMedia] + '.svg'} alt={socialMedia} /></div></a>
        </div>
    );
};

export default SocialMediaTag;

