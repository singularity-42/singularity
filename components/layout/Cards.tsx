import React from "react";
import styles from "./Cards.module.scss";
import Card from "./Card";

interface CardsProps {
  entities: any[];
  onTagClick?: (tag: string) => void;
}

const Cards: React.FC<CardsProps> = ({ entities, onTagClick }) => {
  return (
    <div className={styles.cardGrid}>
      {entities.map((entity: any, index: number) => (
        <div key={`card-${index}`} className={styles.cardWrapper}>
          <Card data={entity} onTagClick={onTagClick} />
        </div>
      ))}
    </div>
  );
};


export default Cards;
