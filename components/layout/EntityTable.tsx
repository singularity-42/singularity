import React, { useEffect, useState } from 'react';
import styles from '../../styles/EntityTable.module.scss';
import EntityFilter from './EntityFilter';
import EntityList from './EntityList';
import useEntityData from '@/hooks/useEntityData';
import Loading from '../util/view/Loading';

export enum OrderType {
   Alphabetical = "Alphabetical",
   Random = "Random",
   CounterAlphabetical = "CounterAlphabetical"
}

interface EntityTableProps {
   type: string;
   orderType?: OrderType;
}

const EntityTable: React.FC<EntityTableProps> = ({ type, orderType = OrderType.Alphabetical }) => {
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
   }, [orderType, entityData]);

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
