import React from 'react';
import styles from './List.module.scss';
import Entity from './Entity';
import Loading from '../content/Loading';
import Error from './Error';
import { on } from 'events';

interface ListProps {
  entityData: any;
  onTagClick?: (tag: string) => void;
  selected?: string[];
}

const List: React.FC<ListProps> = ({ entityData, onTagClick, selected }) => {
  const entitys: any = entityData;

  if (!entitys) {
    return <Loading />;
  }

  if (entitys.length === 0) {
    return <Error error='No entitys found' onClick={
      () => {
        // go a page back
        // window.history.back();
        // reload the page
        window.location.reload();
      }
    } />;
  }

  return (
    <div className={styles.table}>
      <div className={styles.thead}>
        <div>
          <div className={styles.th}>title
          </div>
          {Object.keys(entitys[0].metadata).map((key: string) => (
            <div key={key} className={styles.th}>
              {key}
            </div>
          ))}
        </div>
      </div>
      <div>
        {entitys?.map((entity: any, index: number) => (
          <div key={index} className={styles.entity}>
            <Entity entity={entity} onTagClick={onTagClick} selected={selected} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
