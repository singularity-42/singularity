import React from 'react';
import styles from '@/styles/EntityList.module.scss';
import Entity from './Entity';
import Loading from '../util/view/Loading';
import Error from './Error';

interface EntityListProps {
  entityData: any;
}

const EntityList: React.FC<EntityListProps> = ({ entityData }) => {
  const entitys: any = entityData;

  if (!entitys) {
    return <Loading />;
  }

  if (entitys.length === 0) {
    return <Error error='No entitys found' onClick={
      () => {
        // go a page back
        window.history.back();
      }
    } />;
  }

  return (
    <div className={styles.entityTable}>
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
          <div key={index} className={styles.tr}>
            <Entity entity={entity} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntityList;
