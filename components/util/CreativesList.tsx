import React from 'react';
import { EntityData } from '@/interfaces';
import styles from '@/styles/CreativesList.module.scss';

interface CreativesListProps {
  entityData: EntityData[];
}

const CreativesList: React.FC<CreativesListProps> = ({ entityData }) => {
  const creatives: EntityData[] = entityData;

  if (!creatives) {
    return <div>Loading...</div>;
  }

  if (creatives.length === 0) {
    return <div>No creatives found.</div>;
  }

  return (
    <table className={styles.creativeTable}>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>Title</th>
          {
            Object.keys(creatives[0].metadata).map((key: string) => (
              <th key={key} className={styles.th}>
                {key}
              </th>
            ))
          }
        </tr>
      </thead>
      <tbody>
      
      
        {creatives?.map((creative: EntityData) => (
          <tr key={creative.title}>
            {
              Object.keys(creative.metadata).map((key: string) => (
                <td key={key} className={styles.td}>
                  {creative.metadata[key as keyof typeof creative.metadata] || 'N/A'}
                </td>
              ))
            }
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CreativesList;
