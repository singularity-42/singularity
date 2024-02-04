import React, { useCallback, useMemo } from "react";
import styles from "./Card.module.scss";
import { MdFolderOpen } from 'react-icons/md';
import Tags from "../collections/Tags";
import HoverLink from "../../view/HoverLink";
import { useDetails } from "@/hooks/provider/DetailsProvider";

interface CardProps {
  data: any; // Replace 'any' with the actual type for your data
  onTagClick?: (tag: string) => void;
  isFolder?: boolean;
  isSelected?: boolean;
}

const Card: React.FC<CardProps> = ({ data, onTagClick, isFolder = false, isSelected = false }) => {
  const { setName, toggleVisibility } = useDetails();

  const handleClick = useCallback(() => {
    console.log("Card clicked");
    console.log(data);
    if (isFolder) {
      toggleVisibility();
      setName(data.metadata.title);
    } else {
      toggleVisibility();
      setName(data.metadata.title);
    }
  }, [isFolder, data, toggleVisibility, setName]);

  if (isFolder) {
    const { folder } = data || {};
    return (
      <div className={`${styles.card} ${isSelected ? styles.selected : ""}`}>
        <div className={styles.content} onClick={() => onTagClick && onTagClick(folder.metadata.title)}>
          <div className={styles.title}>{folder.metadata.title.split(/\\|\//).pop().toUpperCase()}</div>
          <div className={styles.icon}>
            <MdFolderOpen />
          </div>
        </div>
        {/* Add additional folder-specific content here */}
      </div>
    );
  } else {
    const { title, tags } = data.metadata;
    const randomImageIndex = data.index % 7 + 1;
    const backgroundImageUrl = useMemo(() => `/glass/00${randomImageIndex}.jpg`, [randomImageIndex]);

    return (
      <div className={styles.card} onClick={handleClick}>
        <div className={styles.bgOverlay} style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: "cover" }} />
        <div className={styles.contentContainer}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{title}</h2>
          </div>
          <div className={styles.socialMediaContainer}>
            <Tags tags={tags} onTagClick={onTagClick} />
          </div>
          {data.metadata.original && (
            <div className={styles.original}>
              ORIGINAL:{" "}
              <HoverLink name={data.metadata.original.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")}>
                {data.metadata.original.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")}
              </HoverLink>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default Card;
