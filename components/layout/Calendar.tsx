"use client";
import React, { useEffect, useState, useMemo } from "react";
import styles from "./Calendar.module.scss";
import useEntities from "@/hooks/useEntities";
import Loading from "../base/Loading";
import { useTooltip } from "@/hooks/provider/TooltipProvider";
import { OrderType } from "@/types";
import { FilterProvider, useFilter } from "@/hooks/provider/FilterProvider";
import Cards from "./Cards";
import { TYPE_DESCRIPTIONS } from "@/types";
import DateComponent from "../base/Date";
import Filter from "../base/Filter";

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
  const [datedEntities, setDatedEntities] = useState<{ [date: string]: any[] }>({});

  useEffect(() => {
    setTooltip(`${type} - ${TYPE_DESCRIPTIONS[type]}`);
  }, [type]);

  useEffect(() => {
    if (entities) {
      const updatedDatedEntities: { [date: string]: any[] } = {};

      entities.forEach((entity) => {
        if (entity.metadata.tags.includes("vergangenheit")) 
          if (!filter.includes("vergangenheit"))
            if (!filter.some((f) => entity.metadata.tags.includes(f))) 
              return;
            

        const date = entity.path.split("\\").slice(0,  3).join("/");
        if (updatedDatedEntities[date]) {
          updatedDatedEntities[date].push(entity);
        } else {
          updatedDatedEntities[date] = [entity];
        }
      });

      Object.keys(updatedDatedEntities).forEach((date) => {
        updatedDatedEntities[date].sort((a, b) => {
          if (orderType === OrderType.CounterAlphabetical) {
            return a.metadata.title.localeCompare(b.metadata.title);
          } else {
            return b.metadata.title.localeCompare(a.metadata.title);
          }
        });
      });

      setDatedEntities(updatedDatedEntities);

      let tags = entities.map((entity) => entity.metadata.tags);
      tags = tags.reduce((acc, val) => acc.concat(val), []);
      setCurrentVisibleTags(tags || []);
    }
  }, [entities]);

  const handleTagClick = (tag: string) => {
    if (tag.length <  1) return;

    if (filter.includes(tag)) {
      setFilter(filter.filter((t) => t !== tag));
    } else {
      setFilter([...filter, tag]);
    }
  };

  const sortByDate = (a: string, b: string) => {
    const dateA = new Date(a);
    const dateB = new Date(b);

    if (dateA > dateB) return  1;
    if (dateA < dateB) return -1;
    return  0;
  }

  const sortedDates = useMemo(() => {
    return Object.keys(datedEntities).sort(sortByDate);
  }, [datedEntities]);

  if (!entities) return <Loading />;
  else
    return (
      <div className={styles.calendar}>
        <Filter currentVisibleTags={currentVisibleTags} />
        {sortedDates.map((date, index) => (
          <div key={date} className={styles.calendarItem}>
            <div className={styles.dateInfo}>
              <DateComponent date={date} />
            </div>
            <Cards entities={datedEntities[date]} onTagClick={handleTagClick} />
          </div>
        ))}
      </div>
    );
};

const Calendar: React.FC<CalendarProps> = ({ type, orderType = OrderType.CounterAlphabetical, maxColumns =  1 }) => {
  return (
    <FilterProvider>
      <CalendarContent type={type} orderType={orderType} />
    </FilterProvider>
  );
};

export default Calendar;
