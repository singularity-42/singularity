import React from 'react';
import styles from '@/styles/EntityFilter.module.scss';

interface EntityFilterProps {
    filter: any;
    onChange: (filter: any) => void;
}

const EntityFilter: React.FC<EntityFilterProps> = ({}) => {
    return (
        <div className={styles.entityFilter}>
        </div>
    );
};

export default EntityFilter;
