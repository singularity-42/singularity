import React from "react";
import styles from "./Cards.module.scss";
import Card from "../components/Card";

interface CardsProps {
  entities: any[];
  onTagClick?: (tag: string) => void;
  selectedFolders: string[];
}

const Cards: React.FC<CardsProps> = ({ entities, onTagClick, selectedFolders }) => {
  return (
    <div className={styles.cardGrid}>
      {entities.map((entity: any, index: number) => (
        <div key={index} className={styles.cardWrapper}>
          {entity.isFolder ? (
            <>  </>
          ) : (
            <Card data={entity} onTagClick={onTagClick} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Cards;
