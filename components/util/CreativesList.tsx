import React from 'react';
import { MarkdownData } from '@/interfaces';
import styles from '@/styles/CreativesList.module.scss';

interface CreativesListProps {
  markdownData: MarkdownData;
}

const CreativesList: React.FC<CreativesListProps> = ({ markdownData }) => {
  const creatives: MarkdownData = markdownData;

  return (
    <table className={styles.creativeTable}>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>Name</th>
          <th className={styles.th}>Role</th>
        </tr>
      </thead>
      <tbody>
      
      
        {creatives?.map((creative) => (
          <tr key={creative.id}>
            <td className={styles.td}>{creative.name}</td>
            <td className={styles.td}>{creative.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CreativesList;
