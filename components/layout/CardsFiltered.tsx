"use client";

import React, { useEffect, useState } from "react";
import styles from "./CardsFiltered.module.scss";
import useFiles from "@/hooks/useFiles";
import Loading from "../base/Loading";
import { useTooltip } from "@/hooks/provider/TooltipProvider";
import { OrderType } from "@/types";
import { FilterProvider, useFilter } from "@/hooks/provider/FilterProvider";
import Cards from "./Cards";
import { TYPE_DESCRIPTIONS } from "@/types";
import Filter from "../base/Filter";

interface CardsFilteredProps {
  category: string;
  orderType?: OrderType;
  maxColumns?: number;
}

const CardsFilteredContent: React.FC<CardsFilteredProps> = ({ category, orderType = OrderType.CounterAlphabetical }) => {
  const { filter, setFilter } = useFilter();
  const { files } = useFiles(category, filter);
  const { setTooltip } = useTooltip();

  const [currentVisibleTags, setCurrentVisibleTags] = useState<string[]>([]);

  useEffect(() => {
    setTooltip(`${category} - ${TYPE_DESCRIPTIONS[category]}`);
  }, [category]);

  useEffect(() => {
    let tags = files?.map((file) => file.metadata.tags);
    // flatten tags
    tags = tags?.reduce((acc, val) => acc.concat(val), []);
    // remove empty tags
    setCurrentVisibleTags(tags ?? []);
  }, [files]);

  useEffect(() => {
    switch (orderType) {
      case OrderType.Alphabetical:
        files?.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case OrderType.Random:
        files?.sort(() => Math.random() - 0.5);
        break;
      case OrderType.CounterAlphabetical:
        files?.sort((a, b) => b.name.localeCompare(a.name));
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

  if (!files) {
    return <Loading />;
  }

  return (
    <div className={styles.table}>
      <div
        className={styles.description}
      />
      <Filter currentVisibleTags={currentVisibleTags} />
      <Cards files={files} onTagClick={handleTagClick}/>
    </div>
  );
};

const CardsFiltered: React.FC<CardsFilteredProps> = ({ category: type, orderType = OrderType.CounterAlphabetical, maxColumns = 1 }) => {
  return (
    <FilterProvider>
      <CardsFilteredContent category={type} orderType={orderType} />
    </FilterProvider>
  );
};

export default CardsFiltered;
