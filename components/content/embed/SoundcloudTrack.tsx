import React from "react";
import styles from "./SoundcloudTrack.module.scss";

interface SoundcloudTrackProps {
  track: string;
}

const SoundcloudTrack: React.FC<SoundcloudTrackProps> = ({ track }) => {
  let trackpath = track.replaceAll('"', "");
  return (
    <div className={styles.soundcloudTrackContainer}>
      <iframe
        className={styles.soundcloudTrack}
        width="100%"
        height="180"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackpath}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
      ></iframe>
    </div>
  );
};

export default SoundcloudTrack;
