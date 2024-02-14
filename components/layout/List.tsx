import React, { useEffect } from "react";
import styles from "./List.module.scss";
import Loading from "../base/Loading";
import Error from "./Error";
import Row from "./Row";

interface ListProps {
  files: any;
  onTagClick?: (tag: string) => void;
  selected?: string[];
}

const List: React.FC<ListProps> = ({ files, onTagClick, selected }) => {
  useEffect(() => {
    const fileElements = document.querySelectorAll(`.${styles.file}`);

    // Apply fade-in animation to each file with a delay
    fileElements.forEach((file: Element, index: number) => {
      const htmlFileContent = file as HTMLElement;
      htmlFileContent.style.opacity = "0";
      htmlFileContent.style.animation = `${styles.fadeIn} 0.5s ease-in-out forwards`;
      htmlFileContent.style.animationDelay = `${index * 0.1}s`;
    });
  }, [files]);

  if (!files) {
    return <Loading />;
  }

  if (files.length === 0) {
    return (
      <Error
        error="No files found"
        onClick={() => {
          // Reload the page
          window.location.reload();
        }}
      />
    );
  }

  const [localFiles, setLocalFiles] = React.useState<any[]>([]);
  const [folders, setFolders] = React.useState<string[]>([]);

  const onFolderClick = (folder: string) => {
    if (!folder) return;

    const isFolderOpen = folders.includes(folder);

    setFolders((prevFolders) =>
      isFolderOpen ? prevFolders.filter((f) => !f.includes(folder)) : [...prevFolders, folder]
    );
  };

  useEffect(() => {
    let visibleFiles: any[] = [];
    let pathFolders: string[] = [];

    files.forEach((file: any) => {
      if (file.path) {
        let path = file.path.split(/\\|\//);
        let folderPath = path.slice(0, path.length - 1).join("\\");
        if (!pathFolders.includes(folderPath) && path.length > 1) {
          visibleFiles.push({
            isFolder: true,
            metadata: {
              title: folderPath,
              tags: [],
            },
          });

          pathFolders.push(folderPath);
        }
        if (path.length === 1 || folders.includes(folderPath)) {
          visibleFiles.push(file);
        }
      }
    });

    if (pathFolders.length === 0) {
      visibleFiles = files;
    }

    // if there is only one folder, open it
    if (pathFolders.length === 1 && !folders.includes(pathFolders[0])) {
      setFolders(pathFolders);
    }

    setLocalFiles(visibleFiles);
  }, [files, folders]);

  return (
    <div className={styles.table}>
      <div className={styles.thead}>{/* Header content */}</div>
      <div className={styles.tbody}>
        {localFiles?.map((file: any, index: number) =>
          file.isFolder ? (
            <div key={index + "folder"} className={`${styles.file} ${styles.folder}`}>
              <Row
                isFolder={true}
                data={{ folder: file }}
                onFolderClick={onFolderClick}
                isSelected={folders.includes(file?.metadata?.title as never) ? true : false}
              />
            </div>
          ) : (
            <div
              key={index}
              className={`${styles.file} ${
                folders.includes(file.path.split(/\\|\//).slice(0, file.path.split(/\\|\//).length - 1).join("\\"))
                  ? styles.inFolder
                  : ""
              }`}
            >
              <Row
                isFolder={false}
                data={{ file }}
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
