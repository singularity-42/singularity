"use client";

import React, { useEffect, useState } from 'react';
import styles from './Table.module.scss';
import Filter from './Filter';
import List from './List';
import useEntityData from '@/hooks/useEntityData';
import Loading from '../content/Loading';
import { useTooltip } from '@/hooks/provider/TooltipProvider';
import { OrderType } from '@/types';
import Details from './Details';
import { FilterProvider, useFilter } from '@/hooks/provider/FilterProvider';

const TYPE_DESCRIPTIONS: { [key: string]: string } = {
    "creatives": "Content creators bringing imagination to life.",
    "collectives": "Groups crafting engaging content together.",
    "concepts": "Ideas shaping the content we adore.",
    "collaborations": "Joint projects creating beloved content.",
    "cyberware": "Tools and services powering the Singularity.",
    "change": "Changes to the Singularity.",
};

interface TableProps {
    type: string;
    orderType?: OrderType;
    maxColumns?: number;
}

const TableContent: React.FC<TableProps> = ({ type, orderType = OrderType.CounterAlphabetical }) => {
    const { filter, setFilter } = useFilter();
    const entityData = useEntityData(type);
    const { setTooltip } = useTooltip();

    const [currentVisibleTags, setCurrentVisibleTags] = useState<string[]>([]);

    useEffect(() => {
        setTooltip(`${type} - ${TYPE_DESCRIPTIONS[type]}`);
    }, [type]);

    useEffect(() => {
        let tags = entityData?.map(entity => entity.metadata.tags);
        // flatten tags
        tags = tags?.reduce((acc, val) => acc.concat(val), []);
        // remove empty tags
        setCurrentVisibleTags(tags ?? []);
    }, [entityData]);

    useEffect(() => {
        switch (orderType) {
            case OrderType.Alphabetical:
                entityData?.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
                break;
            case OrderType.Random:
                entityData?.sort(() => Math.random() - 0.5);
                break;
            case OrderType.CounterAlphabetical:
                entityData?.sort((a, b) => b.metadata.title.localeCompare(a.metadata.title));
                break;
        }
    }, [orderType]);

    if (!entityData) {
        return <Loading />
    }

    return <div className={styles.table}>
        {
            currentVisibleTags.length > 0 &&
            <Filter currentVisibleTags={currentVisibleTags} />
        }


        <List entityData={entityData} onTagClick={(tag: string) => {
            if (tag.length < 1) return;

            if (filter.includes(tag)) {
                setFilter(filter.filter((t) => t !== tag));
            } else {
                setFilter([...filter, tag]);
            }
        }}
            selected={filter}
        />
        {/*
       <EntityPagination /> // for pagination of entitys (by default 10 entitys per page)
       <EntityCreate /> // for creating a new entity
       */}
    </div>;
};

const Table: React.FC<TableProps> = ({ type, orderType = OrderType.CounterAlphabetical, maxColumns = 1 }) => {
    return (
        <FilterProvider>
            <TableContent type={type} orderType={orderType} />
        </FilterProvider>
    );
}

export default Table;
