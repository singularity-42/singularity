"use client";

import React, { useEffect, useState } from "react";
import styles from "./Calendar.module.scss";
import Filter from "../layout/collections/Filter";
import useEntities from "@/hooks/useEntities";
import Loading from "../base/Loading";
import { useTooltip } from "@/hooks/provider/TooltipProvider";
import { OrderType } from "@/types";
import { FilterProvider, useFilter } from "@/hooks/provider/FilterProvider";
import Cards from "../layout/collections/Cards";
import { TYPE_DESCRIPTIONS } from "@/types";
import DateComponent from "../base/Date";

interface CalendarProps {
  type: string;
  orderType?: OrderType;
  maxColumns?: number;
}

const CalendarContent: React.FC<CalendarProps> = ({ type, orderType = OrderType.CounterAlphabetical }) => {
  const { filter, setFilter } = useFilter();
  const entities = useEntities(type, filter);
  const { setTooltip } = useTooltip();

  const [currentVisibleTags, setCurrentVisibleTags] = useState<string[]>([]);

  useEffect(() => {
    setTooltip(`${type} - ${TYPE_DESCRIPTIONS[type]}`);
  }, [type]);

  useEffect(() => {
    let tags = entities?.map((entity) => entity.metadata.tags);
    tags = tags?.reduce((acc, val) => acc.concat(val), []);
    setCurrentVisibleTags(tags ?? []);
  }, [entities]);


  useEffect(() => {
    if (entities) {
      entities.sort((a, b) => {
        const dateA = new Date(a.path.split("\\").slice(0, 3).join("/"));
        const dateB = new Date(b.path.split("\\").slice(0, 3).join("/"));
  
        // Sort in descending order (newest to oldest)
        return dateB.getTime() - dateA.getTime();
      });
    }
  }
  , [entities]);
  
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
    <div className={styles.calendar}>
      <Filter currentVisibleTags={currentVisibleTags} />
      {entities.map((entity, index) => (
        <div key={index}>
          <div className={styles.dateInfo}>
            {/* {`Date: ${entity.path.split("\\").join("/").replace("2024/", "")}`}  example path: 2024\\01\\01\\title.md */}
            <DateComponent date={entity.path} />
          </div>
          <Cards entities={[entity]} onTagClick={handleTagClick} selectedFolders={filter} />
        </div>
      ))}
    </div>
  );
};


const Calendar: React.FC<CalendarProps> = ({ type, orderType = OrderType.CounterAlphabetical, maxColumns = 1 }) => {
  return (
    <FilterProvider>
      <CalendarContent type={type} orderType={orderType} />
    </FilterProvider>
  );
};

export default Calendar;
