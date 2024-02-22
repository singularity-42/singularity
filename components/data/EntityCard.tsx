"use client";

import React, { useCallback, useState } from "react";
import styles from "./EntityCard.module.scss";
import Tags from "./ListTags";
import { useDetails } from "@/hooks/provider/DetailsProvider";
import Markdown from "@/components/data/EntityMarkdown";
import Socials from "./ListSocials";
import { FileContent } from "@/types";
import Connections from "./ListConnections";
import { MdGroups, MdOutlineCalendarMonth, MdPages, MdPerson } from "react-icons/md";

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

  const categoryIcon = ( category: string ) => {
    switch (category){
      case "collaborations":
        return <MdOutlineCalendarMonth />;
      case "collectives":
        return <MdGroups />;
      case "creatives":
        return <MdPerson />;
      case "concepts":
        return <MdPages />;
      default:
        return '';
    } 
  }

  const renderCardContent = () => (
    <div className={styles.card} onClick={handleClick} onContextMenu={handleContextMenu}>
      <div className={styles.contentContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{categoryIcon(category || '')}&nbsp;{name || "&nbsp;"}</h2>
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


/*
"use client";

import React, { useCallback, useState } from "react";
import styles from "./Card.module.scss";
import Link from "../base/Link";
import { useDetails } from "@/hooks/provider/DetailsProvider";
import useImageWithFallback from "@/hooks/useImageWithFallback";
import Markdown from "@/components/layout/Markdown";
import Socials from "../layout/Socials";
import { MdAdd } from "react-icons/md";
import Tags from "./Tags";
import { useFilter } from "@/hooks/provider/FilterProvider";

const CardCreate: React.FC = () => {
  const { setName, toggleVisibility } = useDetails();
  const [isScrolling, setScrolling] = useState(false);
  const { filter } = useFilter();

  const handleClick = useCallback(() => {
    toggleVisibility();
    // If you need to set a name for the create card, you can do it here
    setName("");
  }, [setName, toggleVisibility]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setScrolling(!isScrolling);
  };

  return (
    <div onClick={handleClick} onContextMenu={handleContextMenu} className={`${styles.card} ${styles.create}`} >
      <div className={styles.contentContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{filter.name || ""}</h2>
        </div>
        <div className={styles.tagsContainer}>
          <Tags tags={filter.tags || []} />
        </div>
        <div className={styles.description}>
          <MdAdd />
        </div>
        <div className={styles.socialMediaContainer}>
          <Socials metadata={{}} />
        </div>
      </div>
    </div>
  );
};

export default CardCreate;
*/