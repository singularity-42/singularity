"use client";

import React, { useEffect, useState } from "react";
import styles from "./Table.module.scss";
import Filter from "../layout/collections/Filter";
import useEntities from "@/hooks/useEntities";
import Loading from "../base/Loading";
import { useTooltip } from "@/hooks/provider/TooltipProvider";
import { OrderType } from "@/types";
import { FilterProvider, useFilter } from "@/hooks/provider/FilterProvider";
import Cards from "../layout/collections/Cards";
import { TYPE_DESCRIPTIONS } from "@/app/defaults";

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
    let tags = entities?.map((entity) => entity.metadata.tags);
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
  };

  if (!entities) {
    return <Loading />;
  }

  return (
    <div className={styles.table}>
      <div
        className={styles.description}
      />
      <Filter currentVisibleTags={currentVisibleTags} />
      {/* <List entities={entities} onTagClick={handleTagClick} selected={filter} /> */}
      <Cards entities={entities} onTagClick={handleTagClick} selectedFolders={filter} />
    </div>
  );
};

const Table: React.FC<TableProps> = ({ type, orderType = OrderType.CounterAlphabetical, maxColumns = 1 }) => {
  return (
    <FilterProvider>
      <TableContent type={type} orderType={orderType} />
    </FilterProvider>
  );
};

export default Table;
