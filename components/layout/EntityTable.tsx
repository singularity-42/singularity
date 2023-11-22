"use client"

import React, { useEffect, useState } from 'react';
import styles from '../../styles/EntityTable.module.scss';
import EntityFilter from './EntityFilter';
import EntityList from './EntityList';
import useEntityData from '@/hooks/useEntityData';
import Loading from '../util/view/Loading';

interface EntityTableProps {
    type: string;
}

const EntityTable: React.FC<EntityTableProps> = ({ type }) => {
    const [filter, setFilter] = useState<string[]>([]);
    const entityData = useEntityData(type, filter);

    const [currentVisibleTags, setCurrentVisibleTags] = useState<string[]>([]);

    useEffect(() => {
        let tags = entityData?.map(entity => entity.metadata.tags);
        // flatten tags
        tags = tags?.reduce((acc, val) => acc.concat(val), []);
        setCurrentVisibleTags(tags ?? []);
    }, [entityData]);

    if (!entityData) {
        return <Loading />
    }

    return <div className={styles.entityTable}>
        <EntityFilter filter={filter} currentVisibleTags={currentVisibleTags} onChange={setFilter} />
        <EntityList entityData={entityData} onTagClick={(tag: string) => {
            setFilter([...filter, tag]);
        }} />
        {/*
        <EntityPagination /> // for pagination of entitys (by default 10 entitys per page)
        <EntityCreate /> // for creating a new entity
        */}
    </div>;
};

export default EntityTable;
