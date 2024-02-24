// EntityCard.tsx
import React, { useCallback, useState } from "react";
import styles from "./EntityCard.module.scss";
import Tags from "./ListTags";
import { useEntity } from "@/hooks/provider/EntityProvider";
import EntityMarkdown from "@/components/data/EntityMarkdown";
import Socials from "./ListSocials";
import Connections from "./ListConnections";
import { MdGroups, MdOutlineCalendarMonth, MdPages, MdPerson } from "react-icons/md";
import { FileContent } from "@/types";

interface CardProps {
  file: FileContent;
  onTagClick?: (tag: string) => void;
  showDetailsOverlay?: boolean; // Add a prop to control overlay visibility
  onDetailsButtonClick?: () => void; // Callback for button click
}

const EntityCard: React.FC<CardProps> = ({
  file,
  onTagClick,
  showDetailsOverlay = false,
  onDetailsButtonClick,
}) => {
  const { name, metadata, category, markdown } = file || {};
  const { tags, connections } = metadata || {
    tags: [],
    connections: [],
  };

  const { setName, toggleVisibility } = useEntity();
  const [isScrolling, setScrolling] = useState(false);

  const handleClick = useCallback(() => {
    if (showDetailsOverlay) {
      toggleVisibility();
      setName(name);
    }
  }, [setName, toggleVisibility, name, showDetailsOverlay]);

  const handleDetailsButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDetailsButtonClick) {
      onDetailsButtonClick();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setScrolling(!isScrolling);
  };

  const categoryIcon = (category: string) => {
    switch (category) {
      case "collaborations":
        return <MdOutlineCalendarMonth />;
      case "collectives":
        return <MdGroups />;
      case "creatives":
        return <MdPerson />;
      case "concepts":
        return <MdPages />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.card} onClick={handleClick} onContextMenu={handleContextMenu}>
      <div className={styles.contentContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>
            {categoryIcon(category || '')}&nbsp;{name || "&nbsp;"}
          </h2>
          {showDetailsOverlay && (
            <button className={styles.detailsButton} onClick={handleDetailsButtonClick}>
              Show Details
            </button>
          )}
        </div>
        {connections && (
          <div className={styles.location}>
            <Connections connections={connections as string[]} />
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className={styles.tagsContainer}>
            <Tags tags={typeof tags === "string" ? [tags] : tags} onTagClick={onTagClick} />
          </div>
        )}
        {markdown && (
          <div className={`${styles.description} ${isScrolling ? styles.scrollable : ""}`}>
            <EntityMarkdown content={markdown} active={isScrolling} />
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
};

export default EntityCard;
