import React, { useEffect } from 'react';
import styles from './List.module.scss';
import Entity from './Entity';
import Loading from '../content/Loading';
import Error from './Error';

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
      htmlEntity.style.opacity = '0';
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

  return (
    <div className={styles.table}>
      <div className={styles.thead}>
        {/* Header content */}
      </div>
      <div className={styles.tbody}>
        {entities?.map((entity: any, index: number) => (
          <div key={index} className={styles.entity}>
            <Entity entity={entity} onTagClick={onTagClick} selected={selected} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
