import React from "react";
import styles from "./EntityCardsColumn.module.scss";
import EntityCard from "./EntityCard";
import { FileContent } from "@/app/types";
import useEntities from "@/hooks/useEntities";
// import CardCreate from "./CardCreate";

interface CardsProps {
  loadedFiles?: FileContent[];
}

const EntityCardsColumn: React.FC<CardsProps> = ({ loadedFiles }) => {
  const { files } = useEntities(loadedFiles);
  
  return (
    <div className={styles.cardGrid}>
      {files.map((file: any, index: number) => (
        <div key={`card-${index}`} className={styles.cardWrapper}>
          <EntityCard file={file} showDetailsOverlay={true} />

        </div>
      ))}{files.length === 0 &&
        <div key={`card-create`} className={styles.cardWrapper}>
          <EntityCard showDetailsOverlay={true} />
        </div>}
    </div>
  );
};


export default EntityCardsColumn;
