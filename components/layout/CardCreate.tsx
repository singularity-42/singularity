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
