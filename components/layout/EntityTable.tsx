"use client"

import React, { useState } from 'react';
import styles from '../../styles/EntityTable.module.scss';
import EntityFilter from './EntityFilter';
import EntityList from './EntityList';
import useEntityData from '@/hooks/useEntityData';
import Loading from '../util/view/Loading';



interface EntityTableProps {
    type: string;
}

const EntityTable: React.FC<EntityTableProps> = ({ type }) => {
    const entityData = useEntityData(type);


    // filtered entitys 
    const [filteredEntitys, setFilteredEntitys] = useState(entityData);
    const [filter, setFilter] = useState([]);

    if (!entityData) {
        return <Loading />
    }

    return <div className={styles.entityTable}>
        <EntityFilter filter={filter} onChange={(filter: any) => { setFilter(filter) }} />
        <EntityList entityData={entityData} />
        {/*
        <EntityPagination /> // for pagination of entitys (by default 10 entitys per page)
        <EntityCreate /> // for creating a new entity
        */}
    </div>;
};

export default EntityTable;
