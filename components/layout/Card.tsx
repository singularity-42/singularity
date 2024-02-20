"use client";

import React, { useCallback, useState } from "react";
import styles from "./Card.module.scss";
import Tags from "../layout/Tags";
import { useDetails } from "@/hooks/provider/DetailsProvider";
import Markdown from "@/components/layout/Markdown";
import Socials from "../layout/Socials";
import { FileContent } from "@/types";
import Connections from "./Connections";

interface CardProps {
  file: FileContent
  onTagClick?: (tag: string) => void;
}

const Card: React.FC<CardProps> = ({ file, onTagClick }) => {
  const { name, metadata, category, markdown } = file || {};
  const { tags, connections } = metadata || {};

  const { setName, toggleVisibility } = useDetails();
  const [isScrolling, setScrolling] = useState(false);

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
        {connections && (
          <div className={styles.location}>
            <Connections connections={typeof(connections) === "string" ? [connections] : connections} />
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className={styles.tagsContainer}>
            <Tags tags={typeof(tags) === "string" ? [tags] : tags} onTagClick={onTagClick} />
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
