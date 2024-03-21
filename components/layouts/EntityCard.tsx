// EntityCard.tsx
import React, { useCallback, useState } from "react";
import styles from "./EntityCard.module.scss";
import { useEntityOverlay } from "@/hooks/useEntityOverlay";
import { FileContent } from "@/app/types";
import { IoMdEye } from "react-icons/io";
import Connections from "../collections/ListConnections";
import ListTags from "../collections/ListTags";
import ListSocials from "../collections/ListSocials";
import EntityContent from "./EntityContent";
import { CATEGORY_ICONS } from "@/app/defaults";
import Icon from "../base/Icon";

interface CardProps {
  file?: FileContent;
  className?: string;
  onTagClick?: (tag: string) => void;
  showDetailsOverlay?: boolean; // Add a prop to control overlay visibility
  onDetailsButtonClick?: () => void; // Callback for button click
  hoverDisabled?: boolean;
}

const EntityCard: React.FC<CardProps> = ({
  file,
  onTagClick,
  className,
  showDetailsOverlay = false,
  onDetailsButtonClick,
  hoverDisabled = false,
}) => {
  const { name, date, metadata, category, markdown } = file || {};
  const { tags, connections, image } = metadata || {
    tags: [],
    connections: [],
  };

  const { setName,setDate, toggleVisibility } = useEntityOverlay();
  const [isScrolling, setScrolling] = useState(false);

  const handleClick = useCallback(() => {
    if (showDetailsOverlay) {
      toggleVisibility();
      setName(name as string);
      setDate(date as string);
      setScrolling(false);
    }
  }, [setName, toggleVisibility, name, date, showDetailsOverlay]);

  const handleDetailsButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDetailsButtonClick) {
      onDetailsButtonClick();
    } else {
      toggleVisibility();
      setName(name as string);
      setScrolling(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setScrolling(!isScrolling);
  };

  return (
    <div className={`${styles.card} ${className} ${hoverDisabled ? styles.hoverDisabled : ""}`} onClick={handleClick} onContextMenu={handleContextMenu}>
      <h2 className={styles.titleContainer}>
        <Icon noBorder={true}>{CATEGORY_ICONS[category as string]}</Icon>
        <span>{name}</span>
        {!showDetailsOverlay ? (
          <Icon onClick={handleDetailsButtonClick}> <IoMdEye /> </Icon>
        ) : (
          <></>
        )}
      </h2>
      {connections && (
        <div className={styles.connectionsContainer}>
          <Connections connections={connections as string[]} />
        </div>
      )}
      {metadata && (
        <div className={styles.socialMediaContainer}>
          <ListSocials metadata={metadata} />
        </div>
      )}
      {tags && (tags as string[]).length > 0 && (
        <div className={styles.tagsContainer}>
          <ListTags tags={typeof tags === "string" ? [tags] : (tags as string[])} onTagClick={onTagClick} highlight="sponsor" />
        </div>
      )}
      {markdown && (
        <div className={`${styles.contentContainer} ${isScrolling ? styles.scrollable : ""}`}>
          <EntityContent content={markdown} active={isScrolling} />
        </div>
      )}
      {/* image */}
      {image && (
        <div className={styles.imageContainer}>
          <img
            src={image as string}
            alt=""
            onLoad={() => {
              const img = document.querySelector(`.${styles.imageContainer} img`) as HTMLImageElement;
              img.classList.add(styles.imageLoaded);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EntityCard;
