"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./Card.module.scss";
import { MdFolderOpen } from 'react-icons/md';
import Tags from "../layout/Tags";
import Link from "../base/Link";
import { useDetails } from "@/hooks/provider/DetailsProvider";
import useImageWithFallback from "@/hooks/useImageWithFallback";
import Markdown from "@/components/layout/Markdown";
import Socials from "../layout/Socials";
import Image from "next/legacy/image";

interface CardProps {
  data: any; // Replace 'any' with the actual type for your data
  onTagClick?: (tag: string) => void;
  isFolder?: boolean;
  isSelected?: boolean;
}

const Card: React.FC<CardProps> = ({ data, onTagClick, isFolder = false, isSelected = false }) => {
  const { folder, content } = data || {};
  const { title, tags, location } = data.metadata || {};

  const { imgSrc } = useImageWithFallback(title);
  const { setName, toggleVisibility } = useDetails();
  const [isScrolling, setScrolling] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleClick = useCallback(() => {
    toggleVisibility();
    setName(title);
  }, [setName, toggleVisibility, title]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setScrolling(!isScrolling);
  };

  const renderFolderContent = () => (
    <div className={`${styles.card} ${isSelected ? styles.selected : ""}`}>
      <div className={styles.content} onClick={() => onTagClick && onTagClick(folder.metadata.title)}>
        <div className={styles.title}>{folder.metadata.title.split(/\\|\//).pop().toUpperCase()}</div>
        <div className={styles.icon}>
          <MdFolderOpen />
        </div>
      </div>
    </div>
  );


  const renderCardContent = () => (
    <div className={styles.card} onClick={handleClick} onContextMenu={handleContextMenu}>
      {/* <div className={`${styles.imageContainer} ${loaded ? styles.loaded : ""}`}>
        {imgSrc && <Image
          src={imgSrc}
          alt={title}
          layout='fill'
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          objectFit='cover'
          quality={100}
          onLoadingComplete={() => setLoaded(true)}
        />}
      </div> */}
      <div className={styles.contentContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        {location && location.match(/[a-zA-Z]/) && (
          <div className={styles.location}>
            <Link name={location.replace(/[\[\]"]+/g, "")}>{location.replace(/[\[\]"]+/g, "")}</Link>
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className={styles.tagsContainer}>
            <Tags tags={tags} onTagClick={onTagClick} />
          </div>
        )}
        {content && (
          <div className={`${styles.description} ${isScrolling ? styles.scrollable : ""}`}>
            <Markdown content={data.content} active={isScrolling} />
          </div>
        )}
        {data.metadata && (
          <div className={styles.socialMediaContainer}>
            <Socials metadata={data.metadata} />
          </div>
        )}
      </div>
    </div>
  );

  return isFolder ? renderFolderContent() : renderCardContent();
};

export default Card;
