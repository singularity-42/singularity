"use client";

import React, { useEffect, useState } from 'react';
import styles from './Table.module.scss';
import EntityFilter from './Filter';
import List from './List';
import useEntityData from '@/hooks/useEntityData';
import Loading from '../design/Loading';

export enum OrderType {
   Alphabetical = "Alphabetical",
   Random = "Random",
   CounterAlphabetical = "CounterAlphabetical"
}

interface TableProps {
   type: string;
   orderType?: OrderType;
}

const Table: React.FC<TableProps> = ({ type, orderType = OrderType.CounterAlphabetical }) => {
   const [filter, setFilter] = useState<string[]>([]);
   const entityData = useEntityData(type, filter);

   const [currentVisibleTags, setCurrentVisibleTags] = useState<string[]>([]);

   useEffect(() => {
       let tags = entityData?.map(entity => entity.metadata.tags);
       // flatten tags
       tags = tags?.reduce((acc, val) => acc.concat(val), []);
       setCurrentVisibleTags(tags ?? []);
   }, [entityData]);

   useEffect(() => {
       switch(orderType) {
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
       <EntityFilter filter={filter} currentVisibleTags={currentVisibleTags} onChange={setFilter} />
       <List entityData={entityData} onTagClick={(tag: string) => {
           setFilter([...filter, tag]);
       }} />
       {/*
       <EntityPagination /> // for pagination of entitys (by default 10 entitys per page)
       <EntityCreate /> // for creating a new entity
       */}
   </div>;
};

export default Table;
