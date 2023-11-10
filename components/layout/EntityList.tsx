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
    <table className={styles.entityTable}>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>title
          </th>
          {Object.keys(entitys[0]).map((key: string) => (
            <th key={key} className={styles.th}>
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {entitys?.map((entity: any, index: number) => (
          <tr key={index} className={styles.tr}>
            <Entity entity={entity} />
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EntityList;
