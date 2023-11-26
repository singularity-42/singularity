"use client";

import React, { useEffect, useState } from 'react';
import styles from './Table.module.scss';
import Filter from './Filter';
import List from './List';
import useEntities from '@/hooks/useEntities';
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
    const entities = useEntities(type, filter);
    const { setTooltip } = useTooltip();

    const [currentVisibleTags, setCurrentVisibleTags] = useState<string[]>([]);

    useEffect(() => {
        setTooltip(`${type} - ${TYPE_DESCRIPTIONS[type]}`);
    }, [type]);

    useEffect(() => {
        let tags = entities?.map(entity => entity.metadata.tags);
        // flatten tags
        tags = tags?.reduce((acc, val) => acc.concat(val), []);
        // remove empty tags
        setCurrentVisibleTags(tags ?? []);
    }, [entities]);

    useEffect(() => {
        switch (orderType) {
            case OrderType.Alphabetical:
                entities?.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
                break;
            case OrderType.Random:
                entities?.sort(() => Math.random() - 0.5);
                break;
            case OrderType.CounterAlphabetical:
                entities?.sort((a, b) => b.metadata.title.localeCompare(a.metadata.title));
                break;
        }
    }, [orderType]);

    const handleTagClick = (tag: string) => {
        if (tag.length < 1) return;

        if (filter.includes(tag)) {
            setFilter(filter.filter((t) => t !== tag));
        } else {
            setFilter([...filter, tag]);
        }
    }

    if (!entities) {
        return <Loading />
    }

    return <div className={styles.table}>
        <div style={
            {
                height: '4.2rem', // TODO: fix this and find better spacer solution
            }
        } />
        <Filter currentVisibleTags={currentVisibleTags} />
        <List entities={entities} onTagClick={handleTagClick} selected={filter} />
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
