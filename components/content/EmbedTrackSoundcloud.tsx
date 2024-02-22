import React from "react";
import styles from "./EmbedTrackSoundcloud.module.scss";

interface SoundcloudTrackProps {
  track: string;
}

const EmbedTrackSoundcloud: React.FC<SoundcloudTrackProps> = ({ track }) => {
  let track_path = track.replaceAll('"', "");
  return (
    <div className={styles.soundcloudTrackContainer}>
      <iframe
        className={styles.soundcloudTrack}
        width="100%"
        height="180"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track_path}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
      ></iframe>
    </div>
  );
};

export default EmbedTrackSoundcloud;
