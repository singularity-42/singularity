import React from "react";
import styles from "./EntityCardsColumn.module.scss";
import EntityCard from "./EntityCard";
// import CardCreate from "./CardCreate";

interface CardsProps {
  files: any[];
  onTagClick?: (tag: string) => void;
}

const EntityCardsColumn: React.FC<CardsProps> = ({ files, onTagClick }) => {
  return (
    <div className={styles.cardGrid}>
      {files.map((file: any, index: number) => (
        <div key={`card-${index}`} className={styles.cardWrapper}>
          <EntityCard file={file} onTagClick={onTagClick} showDetailsOverlay={true} />

        </div>
      ))}{files.length === 0 &&
        <div key={`card-create`} className={styles.cardWrapper}>
          <EntityCard onTagClick={onTagClick} showDetailsOverlay={true} />
        </div>}
    </div>
  );
};


export default EntityCardsColumn;
