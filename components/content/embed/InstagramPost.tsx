import { InstagramEmbed } from 'react-social-media-embed';
import React from "react";
import styles from "./InstagramPost.module.scss";

interface InstagramPostProps {
  post: string;
}

const InstagramPost: React.FC<InstagramPostProps> = ({ post }) => {
  return (
    <div className={styles.instagramPost}>
      <InstagramEmbed url="https://www.instagram.com/r/{post}/" width={328} />
    </div>
  );
};

export default InstagramPost;
