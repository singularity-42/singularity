import React, { useEffect } from "react";
import styles from "./List.module.scss";
import Entity from "./Entity";
import Loading from "../content/Loading";
import Error from "./Error";
import Parent from "../content/Parent";

interface ListProps {
  entities: any;
  onTagClick?: (tag: string) => void;
  selected?: string[];
}

const List: React.FC<ListProps> = ({ entities, onTagClick, selected }) => {
  useEffect(() => {
    const entityElements = document.querySelectorAll(`.${styles.entity}`);

    // Apply fade-in animation to each entity with a delay
    entityElements.forEach((entity: Element, index: number) => {
      const htmlEntity = entity as HTMLElement;
      htmlEntity.style.opacity = "0";
      htmlEntity.style.animation = `${styles.fadeIn} 0.5s ease-in-out forwards`;
      htmlEntity.style.animationDelay = `${index * 0.1}s`;
    });
  }, [entities]);

  if (!entities) {
    return <Loading />;
  }

  if (entities.length === 0) {
    return (
      <Error
        error="No entities found"
        onClick={() => {
          // Reload the page
          window.location.reload();
        }}
      />
    );
  }

  // at entities each entity.metadata.title is the path to the file
  const [localEntities, setLocalEntities] = React.useState<any[]>([]);
  const [folders, setFolders] = React.useState<string[]>([]);


  const onFolderClick = (folder: string) => {
    if (!folder) return;

    const isFolderOpen = folders.includes(folder);

    setFolders((prevFolders) =>
      isFolderOpen ? prevFolders.filter((f) => !f.includes(folder)) : [...prevFolders, folder]
    );
  };

  useEffect(() => {
    let visibleEntities: any[] = [];
    let pathFolders: string[] = [];

    entities.forEach((entity: any) => {
      if (entity.path) {
        let path = entity.path.split(/\\|\//);
        let folderPath = path.slice(0, path.length - 1).join("\\");
        if (!pathFolders.includes(folderPath) && path.length > 1) {
          // check if folder should be visible by selected folders
          let folderPath = path.slice(0, path.length - 1).join("\\");

          visibleEntities.push({
            isFolder: true,
            metadata: {
              title: folderPath,
              tags: [],
            },
            path: folderPath,
            content: "",
          });

          pathFolders.push(folderPath);
        }
        if (path.length == 1 || folders.includes(folderPath)) {
          visibleEntities.push(entity);
        }
      }
    });

    if (pathFolders.length === 0) {
      visibleEntities = entities;
    }

// if there is only one folder, open it
if (pathFolders.length === 1 && !folders.includes(pathFolders[0])) {
  setFolders(pathFolders);
}

setLocalEntities(visibleEntities);
  }, [entities, folders]);

return (
  <div className={styles.table}>
    <div className={styles.thead}>{/* Header content */}</div>
    <div className={styles.tbody}>
      {localEntities?.map((entity: any, index: number) =>
        entity.isFolder || false ? (
          <div
            key={index + "folder"}
            className={`${styles.entity} ${styles.folder}`} >
            <Parent
              title={entity.metadata.title}
              onFolderClick={onFolderClick}
              selected={folders.includes(entity?.metadata?.title as never)}
            />
          </div>
        ) : (
          <div key={index} className={`${styles.entity} ${folders.includes(entity.path.split(/\\|\//).slice(0, entity.path.split(/\\|\//).length - 1).join("\\")) ? styles.inFolder : ""}`}>
            <Entity entity={entity} onTagClick={onTagClick} selected={selected} />
          </div>
        )
      )}
    </div>
  </div>
);
};

export default List;
