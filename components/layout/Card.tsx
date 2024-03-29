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
  file: any; // Replace 'any' with the actual type for your data
  onTagClick?: (tag: string) => void;
}

const Card: React.FC<CardProps> = ({ file, onTagClick }) => {
  const { name, metadata, category, markdown } = file || {};
  const { tags, location } = metadata || {};

  // const { imgSrc } = useImageWithFallback(name);
  const { setName, toggleVisibility } = useDetails();
  const [isScrolling, setScrolling] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleClick = useCallback(() => {
    toggleVisibility();
    setName(name);
  }, [setName, toggleVisibility, name]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setScrolling(!isScrolling);
  };

  const renderCardContent = () => (
    <div className={styles.card} onClick={handleClick} onContextMenu={handleContextMenu}>
      <div className={styles.contentContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{name}</h2>
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
        {markdown && (
          <div className={`${styles.description} ${isScrolling ? styles.scrollable : ""}`}>
            <Markdown content={markdown} active={isScrolling} />
          </div>
        )}
        {file.metadata && (
          <div className={styles.socialMediaContainer}>
            <Socials metadata={file.metadata} />
          </div>
        )}
      </div>
    </div>
  );

  return renderCardContent();
};

export default Card;
