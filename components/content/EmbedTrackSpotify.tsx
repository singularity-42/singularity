import React from 'react';  
import styles from './EmbedTrackSpotify.module.scss';

interface SpotifyTrackProps {
    track: string;
}

const EmbedTrackSpotify: React.FC<SpotifyTrackProps> = ({ track }) => {
    return (
      <iframe  src={`https://open.spotify.com/embed/track/${track}?utm_source=generator&theme=0`} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    )
}

export default EmbedTrackSpotify;
