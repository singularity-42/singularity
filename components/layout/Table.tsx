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

interface TableProps {
    type: string;
    orderType?: OrderType;
}

const TYPE_DESCRIPTIONS: { [key: string]: string } = {
    "creatives": "Content creators bringing imagination to life.",
    "collectives": "Groups crafting engaging content together.",
    "concepts": "Ideas shaping the content we adore.",
    "collaborations": "Joint projects creating beloved content.",
};

const Table: React.FC<TableProps> = ({ type, orderType = OrderType.CounterAlphabetical }) => {
    const [filter, setFilter] = useState<string[]>([]);
    const entityData = useEntityData(type, filter);
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

        {/* pop up section which will be filling the screen having a blose button on top right */}

        <Details />
        
        {
            currentVisibleTags.length > 0 &&
            <Filter filter={filter} currentVisibleTags={currentVisibleTags} onChange={setFilter} />
        }


        <List entityData={entityData} onTagClick={(tag: string) => {
            if(tag.length < 1) return;

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

export default Table;
