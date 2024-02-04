import React, { useEffect } from "react";
import styles from "./List.module.scss";
import Loading from "../../base/Loading";
import Error from "../components/Error";
import Row from "../components/Row";

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
          visibleEntities.push({
            isFolder: true,
            metadata: {
              title: folderPath,
              tags: [],
            },
          });

          pathFolders.push(folderPath);
        }
        if (path.length === 1 || folders.includes(folderPath)) {
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
          entity.isFolder ? (
            <div key={index + "folder"} className={`${styles.entity} ${styles.folder}`}>
              <Row
                isFolder={true}
                data={{ folder: entity }}
                onFolderClick={onFolderClick}
                isSelected={folders.includes(entity?.metadata?.title as never) ? true : false}
              />
            </div>
          ) : (
            <div
              key={index}
              className={`${styles.entity} ${
                folders.includes(entity.path.split(/\\|\//).slice(0, entity.path.split(/\\|\//).length - 1).join("\\"))
                  ? styles.inFolder
                  : ""
              }`}
            >
              <Row
                isFolder={false}
                data={{ entity }}
                onTagClick={onTagClick}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default List;
