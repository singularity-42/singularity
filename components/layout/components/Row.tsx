import React from 'react';
import styles from './Row.module.scss';
import { MdFolderOpen } from 'react-icons/md';
import Markdown from '../../view/Markdown';
import Tags from '../collections/Tags';
import HoverLink from '../../view/HoverLink';
import { useDetails } from '@/hooks/provider/DetailsProvider';
import Gallery from '../../base/Gallery';
import DaysUntil from '@/components/utils/DaysUntil';

interface RowProps {
  isFolder?: boolean;
  isSelected?: boolean;
  data: any; // Replace 'any' with the actual type for your data
  onFolderClick?: (title: string) => void;
  onTagClick?: (tag: string) => void;
}

const Row: React.FC<RowProps> = ({ isFolder = false, isSelected = false, data, onFolderClick, onTagClick }) => {
  const { setName, toggleVisibility } = useDetails();

  const handleClick = () => {
    if (isFolder) {
      onFolderClick && onFolderClick(data.title);
    } else {
      toggleVisibility();
      setName(data.entity.metadata.title);
    }
  };

  if (isFolder) {
    const { title } = data;
    return (
      <div className={`${styles.folder} ${isSelected ? styles.isSelected : ''}`} onClick={handleClick}>
        <div className={styles.parentTitle}>{title.split(/\\|\//).pop().toUpperCase()}</div>
        <div className={styles.parentIcon}>
          <MdFolderOpen />
        </div>
      </div>
    );
  } else {
    const { entity } = data;
    const { title, tags } = entity.metadata;
    const content = entity.content;

    return (
      <div className={styles.entityContainer} onClick={handleClick}>
        <div className={styles.socialMediaContainer}>
          <h2 className={styles.title}>
          {(() => {
            if (title.includes("-")) {
              const [year, month, day] = title.split("-").map(Number);
              
              const weekday = new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short' });
              
              return (
                <div className={styles.dateContainer}>
                  <p className={styles.date}>{`${weekday} ${day}.${month}.${year}`}</p>
                  <DaysUntil date={title} />
                </div>
              );
            }

            const name = title.split(/\\|\//).pop();
            return <p className={styles.date}>{name}</p>;
          })()}
          </h2>
          <Tags tags={tags} onTagClick={onTagClick} />
        </div>

        {entity.metadata.original && (
          <div className={styles.original}>
            ORIGINAL:{" "}
            <HoverLink name={entity.metadata.original.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")}>
              {" "}
              {entity.metadata.original.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")}{" "}
            </HoverLink>
          </div>
        )}
      </div>
    );
  }
};

export default Row;
