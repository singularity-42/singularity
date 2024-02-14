"use client";
import React, { useEffect, useState, useMemo } from "react";
import styles from "./Calendar.module.scss";
import useFiles from "@/hooks/useFiles";
import Loading from "../base/Loading";
import { useTooltip } from "@/hooks/provider/TooltipProvider";
import { OrderType } from "@/types";
import { FilterProvider, useFilter } from "@/hooks/provider/FilterProvider";
import Cards from "./Cards";
import { TYPE_DESCRIPTIONS } from "@/types";
import DateComponent from "../base/Date";
import Filter from "../base/Filter";

interface CalendarProps {
  category: string;
  orderType?: OrderType;
  maxColumns?: number;
}

const CalendarContent: React.FC<CalendarProps> = ({ category, orderType = OrderType.CounterAlphabetical }) => {
  const { filter, setFilter } = useFilter();
  const { files, loading, error } = useFiles(category, filter);
  const { setTooltip } = useTooltip();

  const [currentVisibleTags, setCurrentVisibleTags] = useState<string[]>([]);
  const [datedFiles, setDatedFiles] = useState<{ [date: string]: any[] }>({});

  useEffect(() => {
    setTooltip(`${category} - ${TYPE_DESCRIPTIONS[category]}`);
  }, [category]);

  useEffect(() => {
    if (files) {
      const updatedDatedFiles: { [date: string]: any[] } = {};

      files.forEach((file) => {
        let date = file.date.split("-").reverse().join(".")
        if (updatedDatedFiles[date]) {
          updatedDatedFiles[date].push(file);
        } else {
          updatedDatedFiles[date] = [file];
        }
      });

      Object.keys(updatedDatedFiles).forEach((date) => {
        updatedDatedFiles[date].sort((a, b) => {
          if (orderType === OrderType.CounterAlphabetical) {
            return a.name.localeCompare(b.name);
          } else {
            return b.name.localeCompare(a.name);
          }
        });
      });

      setDatedFiles(updatedDatedFiles);

      let tags = files.map((file) => file.metadata.tags);
      tags = tags.reduce((acc, val) => acc.concat(val), []);
      setCurrentVisibleTags(tags || []);
    }
  }, [files]);

  const handleTagClick = (tag: string) => {
    if (tag.length < 1) return;

    if (filter.includes(tag)) {
      setFilter(filter.filter((t) => t !== tag));
    } else {
      setFilter([...filter, tag]);
    }
  };

  const sortByDate = (a: string, b: string) => {
    const dateA = new Date(a);
    const dateB = new Date(b);

    if (dateA > dateB) return 1;
    if (dateA < dateB) return -1;
    return 0;
  };

  const sortedDates = useMemo(() => {
    return Object.keys(datedFiles).sort(sortByDate);
  }, [datedFiles]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;
  if (!files) return null;

  return (
    <div className={styles.calendar}>
      <Filter currentVisibleTags={currentVisibleTags} />
      {sortedDates.map((date, index) => (
        <div key={date} className={styles.calendarItem}>
          <div className={styles.dateInfo}>
            <DateComponent date={date} />
          </div>
          <Cards files={datedFiles[date]} onTagClick={handleTagClick} />
        </div>
      ))}
    </div>
  );
};

const Calendar: React.FC<CalendarProps> = ({ category: type, orderType = OrderType.CounterAlphabetical, maxColumns = 1 }) => {
  return (
    <FilterProvider>
      <CalendarContent category={type} orderType={orderType} />
    </FilterProvider>
  );
};

export default Calendar;
