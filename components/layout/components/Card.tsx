"use client";

import React, { useCallback, useMemo } from "react";
import styles from "./Card.module.scss";
import { MdFolderOpen } from 'react-icons/md';
import Tags from "../collections/Tags";
import HoverLink from "../../view/HoverLink";
import { useDetails } from "@/hooks/provider/DetailsProvider";
import useImageWithFallback from "@/hooks/useImageWithFallback";
import Markdown from "@/components/view/Markdown";
import Socials from "../collections/Socials";

interface CardProps {
  data: any; // Replace 'any' with the actual type for your data
  onTagClick?: (tag: string) => void;
  isFolder?: boolean;
  isSelected?: boolean;
}

const Card: React.FC<CardProps> = ({ data, onTagClick, isFolder = false, isSelected = false }) => {
  const { setName, toggleVisibility } = useDetails();

  const handleClick = useCallback(() => {
      toggleVisibility();
      setName(data.metadata.title);
  }, [setName, toggleVisibility, data]);

  const { title, tags } = data.metadata;
  const { imgSrc } = useImageWithFallback(title);
  const { folder } = data || {};

  return isFolder ? (
    <div className={`${styles.card} ${isSelected ? styles.selected : ""}`}>
      <div className={styles.content} onClick={() => onTagClick && onTagClick(folder.metadata.title)}>
        <div className={styles.title}>{folder.metadata.title.split(/\\|\//).pop().toUpperCase()}</div>
        <div className={styles.icon}>
          <MdFolderOpen />
        </div>
      </div>
      {/* Add additional folder-specific content here */}
    </div>
  ) : (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.bgOverlay} style={{ backgroundImage: `url(${imgSrc})`, backgroundSize: "cover" }} />
      <div className={styles.contentContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>
        </div>
          {
          // data.metadata.location && ( only display if location does contain letters and []
          data.metadata.location && data.metadata.location.match(/[a-zA-Z]/) && (
            <div className={styles.location}>
              <HoverLink name={data.metadata.location.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")}>
                {data.metadata.location.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")}
              </HoverLink>
            </div>
          )
       } 
        {tags && tags.length > 0 &&
          <div className={styles.tagsContainer}>
            <Tags tags={tags} onTagClick={onTagClick} />
          </div>}
          {/* display start and end (are numbers of hours in day eg 5 or 23) */}
        {data.metadata.start && (
          <div className={styles.time}>
            {data.metadata.start} - {(data.metadata.end ? data.metadata.end : "open")}
          </div>
        )}
        {/* display entry info string */}
        {data.metadata.entry && (
          <div className={styles.entry}>
            {data.metadata.entry}
          </div>
        )}
        {/* display original link */}
        {data.metadata.original && (
          <div className={styles.original}>
            ORIGINAL:{" "}
            <HoverLink name={data.metadata.original.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")}>
              {data.metadata.original.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")}
            </HoverLink>
          </div>
        )}
        <div className={styles.description}>
          <Markdown content={data.content.length > 420 ? `${data.content.substring(0, 420)}...` : data.content} active={true} />
        </div>

        <div className={styles.socialMediaContainer}>
          <Socials metadata={data.metadata} />
        </div>

      </div>
    </div>
  );
}

export default Card;