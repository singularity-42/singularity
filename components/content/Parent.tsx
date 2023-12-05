import React from 'react';
import styles from './Parent.module.scss';
import { MdFolderOpen } from 'react-icons/md';

const Parent: React.FC<any> = ({ title, onFolderClick, selected }) => {
  return (
    <div className={`${styles.parent} ${selected ? styles.selected : ''}`} onClick={() => onFolderClick(title)}>
      <div className={styles.parentTitle}>{title.split(/\\|\//).pop().toUpperCase()}</div>
      <div className={styles.parentIcon}>
        <MdFolderOpen />
      </div>
    </div>
  );
}

export default Parent;