{/* <div className={styles.tagsContainer}>
{website && <SocialMediaTag socialMedia={SocialMedia.Website} username={website} />}
{spotify && <SocialMediaTag socialMedia={SocialMedia.Spotify} username={spotify} />}
{beatport && <SocialMediaTag socialMedia={SocialMedia.Beatport} username={beatport} />}
{telegram && <SocialMediaTag socialMedia={SocialMedia.Telegram} username={telegram} />}
{soundcloud && <SocialMediaTag socialMedia={SocialMedia.SoundCloud} username={soundcloud} />}
{instagram && <SocialMediaTag socialMedia={SocialMedia.Instagram} username={instagram} />}
</div> */}

import React from 'react';
import styles from './Entity.module.scss';
import SocialMediaTag, { SocialMedia } from '../content/SocialMedia';

interface SocialMediasProps {
    website?: string;
    spotify?: string;
    beatport?: string;
    telegram?: string;
    soundcloud?: string;
    instagram?: string;
}

const SocialMedias: React.FC<SocialMediasProps> = ({ website, spotify, beatport, telegram, soundcloud, instagram }) => {
    return <div className={styles.tagsContainer}>
        {website && <SocialMediaTag socialMedia={SocialMedia.Website} username={website} />}
        {spotify && <SocialMediaTag socialMedia={SocialMedia.Spotify} username={spotify} />}
        {beatport && <SocialMediaTag socialMedia={SocialMedia.Beatport} username={beatport} />}
        {telegram && <SocialMediaTag socialMedia={SocialMedia.Telegram} username={telegram} />}
        {soundcloud && <SocialMediaTag socialMedia={SocialMedia.SoundCloud} username={soundcloud} />}
        {instagram && <SocialMediaTag socialMedia={SocialMedia.Instagram} username={instagram} />}
    </div>;
}
export default SocialMedias;
