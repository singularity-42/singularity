import React from "react";
import styles from "./Cards.module.scss";
import Card from "./Card";

interface CardsProps {
  files: any[];
  onTagClick?: (tag: string) => void;
}

const Cards: React.FC<CardsProps> = ({ files, onTagClick }) => {
  return (
    <div className={styles.cardGrid}>
      {files.map((file: any, index: number) => (
        <div key={`card-${index}`} className={styles.cardWrapper}>
          <Card file={file} onTagClick={onTagClick} />
        </div>
      ))}
    </div>
  );
};


export default Cards;
