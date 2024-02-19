import React from 'react';
import { IconContext } from 'react-icons';
import {
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhone,
    FaInstagram,
    FaYoutube,
    FaSoundcloud,
    FaSpotify,
    FaBandcamp,
    FaTelegramPlane,
    FaTwitter,
    FaFacebook
} from 'react-icons/fa';
import { MdAdd, MdWeb } from 'react-icons/md';

export enum SocialMedia {
    website = 'website',
    mail = 'mail',
    address = 'address',
    tel = 'tel',
    instagram = 'instagram',
    youtube = 'youtube',
    soundcloud = 'soundcloud',
    spotify = 'spotify',
    facebook = 'facebook',
    bandcamp = 'bandcamp',
    telegram = 'telegram',
    twitter = 'twitter',
    add = 'add'
}

import styles from './Social.module.scss';

const getSocialMediaIcon = (socialMedia: SocialMedia) => {
    switch (socialMedia) {
        case SocialMedia.website:
            return <MdWeb />;
        case SocialMedia.instagram:
            return <FaInstagram />;
        case SocialMedia.youtube:
            return <FaYoutube />;
        case SocialMedia.soundcloud:
            return <FaSoundcloud />;
        case SocialMedia.spotify:
            return <FaSpotify />;
        case SocialMedia.bandcamp:
            return <FaBandcamp />;
        case SocialMedia.telegram:
            return <FaTelegramPlane />;
        case SocialMedia.facebook:
            return <FaFacebook />;
        case SocialMedia.twitter:
            return <FaTwitter />;
        case SocialMedia.mail:
            return <FaEnvelope />;
        case SocialMedia.address:
            return <FaMapMarkerAlt />;
        case SocialMedia.tel:
            return <FaPhone />;
        case SocialMedia.add:
            return <MdAdd />;
        default:
            return null;
    }
};

interface SocialMediaTagProps {
    socialMedia: SocialMedia;
    username: string;
    onClick?: (e: React.MouseEvent) => void;
}

const Social: React.FC<SocialMediaTagProps> = ({ socialMedia, username, onClick }) => {
    if (!username) return null;

    const Icon = getSocialMediaIcon(socialMedia);
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
