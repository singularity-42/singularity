import React from 'react';
import styles from './Social.module.scss';
import SocialIcon from './SocialIcon';

export enum SocialMedia {
    website = 'website',
    mail = 'mail',
    address = 'address',
    tel = 'tel',
    instagram = 'instagram',
    youtube = 'youtube',
    soundcloud = 'soundcloud',
    spotify = 'spotify',
    beatport = 'beatport',
    bandcamp = 'bandcamp',
    telegram = 'telegram',
    twitter = 'twitter',
}

interface SocialMediaTagProps {
    socialMedia: SocialMedia;
    username: string;
}

const getSocialMediaUrl = (socialMedia: SocialMedia, username: string) => {
    switch (socialMedia) {
        case SocialMedia.website:
            return `https://${username}`;
        case SocialMedia.instagram:
            return 'https://www.instagram.com/' + username;
        case SocialMedia.youtube:
            return 'https://www.youtube.com/' + username;
        case SocialMedia.soundcloud:
            return 'https://soundcloud.com/' + username;
        case SocialMedia.spotify:
            return 'https://open.spotify.com/artist/' + username;
        case SocialMedia.beatport:
            return 'https://www.beatport.com/artist/' + username;
        case SocialMedia.bandcamp:
            return 'https://' + username;
        case SocialMedia.telegram:
            return 'https://t.me/' + username;
        case SocialMedia.twitter:
            return 'https://twitter.com/' + username;
        case SocialMedia.mail:
            return 'mailto:' + username;
        case SocialMedia.address:
            return 'https://maps.google.com/?q=' + username;
        case SocialMedia.tel:
            return 'tel:' + username;
        default:
            return '';
    }
};

const Social: React.FC<SocialMediaTagProps> = ({ socialMedia, username }) => {
    if (!username) {
        return null;
    }

    const socialMediaUrl = getSocialMediaUrl(socialMedia, username);

    const handleSocialMediaClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        window.open(socialMediaUrl);
    }

    return (
        <div className={styles.socialMediaTag + ' ' + styles[socialMedia]} onClick={handleSocialMediaClick}>
            <SocialIcon name={socialMedia} size='2rem' />
        </div>
    );
};

export default Social;
