
// social media tag has enum for all social media types and a  value for the username

import React from 'react';
import styles from './SocialMedia.module.scss';
import Icon from './Icon';
import Image from 'next/image';

export enum SocialMedia {
    website = 'website',
    instagram = 'instagram',
    youtube = 'youtube',
    soundcloud = 'soundcloud',
    spotify = 'spotify',
    beatport = 'beatport',
    bandcamp = 'bandcamp',
    telegram = 'telegram',
    twitter = 'twitter',
}

enum SocialMediaUrl {
    website = 'https://',
    instagram = 'https://www.instagram.com/',
    youtube = 'https://www.youtube.com/@',
    soundcloud = 'https://soundcloud.com/',
    spotify = 'https://open.spotify.com/artist/',
    beatport = 'https://www.beatport.com/artist/',
    bandcamp = 'https://',
    telegram = 'https://t.me/',
    twitter = 'https://twitter.com/',
}

enum SocialMediaIcon {
    website = '/icons/socials/website',
    instagram = '/icons/socials/instagram',
    youtube = '/icons/socials/youtube-color-svgrepo-com',
    soundcloud = '/icons/socials/soundcloud',
    spotify = '/icons/socials/spotify-svgrepo-com',
    beatport = '/icons/socials/beatport',
    bandcamp = '/icons/socials/beatport',
    telegram = '/icons/socials/telegram',
    twitter = '/icons/socials/x',
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
            {/* <a href={SocialMediaUrl[socialMedia] + username} target="_blank" rel="noopener noreferrer"><div className={styles.socialMediaIcon}><img src={SocialMediaIcon[socialMedia] + '.svg'} alt={socialMedia} /></div></a> */}
            <a href={SocialMediaUrl[socialMedia] + username} target="_blank" rel="noopener noreferrer">
                <Image src={SocialMediaIcon[socialMedia] + '.svg'} alt={socialMedia} width={20} height={20} />
            </a>
        </div>
    );
};

export default SocialMediaTag;

