"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./CardsFiltered.module.scss";
import useFiles from "@/hooks/useFiles";
import Loading from "../base/Loading";
import { useTooltip } from "@/hooks/provider/TooltipProvider";
import { OrderType } from "@/types";
import { FilterProvider, useFilter } from "@/hooks/provider/FilterProvider";
import Cards from "./Cards";
import { TYPE_DESCRIPTIONS } from "@/types";
import Filter from "../base/Filter";
import DateComponent from "../base/Date";

interface CardsFilteredProps {
  category: string;
  orderType?: OrderType;
  isCalender?: boolean;
}

const CardsFilteredContent: React.FC<CardsFilteredProps> = ({ category, orderType = OrderType.CounterAlphabetical, isCalender }) => {
  const { filter, setFilterTags } = useFilter();
  const { files, loading, error } = useFiles(category, filter.tags);
  const { setTooltip } = useTooltip();

  const [currentVisibleTags, setCurrentVisibleTags] = useState<string[]>([]);
  const [datedFiles, setDatedFiles] = useState<{ [date: string]: any[] }>({});

  useEffect(() => {
    setTooltip(`${category} - ${TYPE_DESCRIPTIONS[category]}`);
  }, [category]);

  useEffect(() => {
    if (files) {
      let tags = files?.map((file) => file.metadata.tags);

      if (isCalender) {
        const updatedDatedFiles: { [date: string]: any[] } = {};

        files.forEach((file) => {
          let date = file.date.split(/-/gm).reverse().join(".");
          if (updatedDatedFiles[date]) updatedDatedFiles[date].push(file);
          else updatedDatedFiles[date] = [file];
        });

        Object.keys(updatedDatedFiles).forEach((date) => {
          updatedDatedFiles[date].sort((a, b) => {
            if (orderType === OrderType.CounterAlphabetical) return a.name.localeCompare(b.name);
            else return b.name.localeCompare(a.name);
          });
        });

        setDatedFiles(updatedDatedFiles);
      }

      let category = files?.map((file) => file.category);
      let connections = files?.map((file) => file.metadata.connections);

      // add connections and connections to tags
      tags = tags?.concat(connections ?? []).concat(connections ?? []).concat(category ?? []);
      // flatten array
      tags = tags?.flat();
      // remove empty strings
      tags = tags?.filter((tag) => (tag?.length || 0) > 0);
      // remove duplicates
      tags = tags?.filter((tag, index) => tags?.indexOf(tag) === index);

      setCurrentVisibleTags(tags ?? []);
    }
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


  const handleTagClick = (tag: string) => {
    if (tag.length < 1) return;

    if (filter.tags.includes(tag)) {
      setFilterTags(filter.tags.filter((t: string) => t !== tag));
    } else {
      setFilterTags([...filter.tags, tag]);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p> Error: {error || "unknown"} </p>;
  if (!files) return null;
  if (isCalender) {
    return (
      <div className={styles.filterCardsContainer}>
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
  } else {
    return (
      <div className={styles.filterCardsContainer}>
        <Filter currentVisibleTags={currentVisibleTags} />
        <Cards files={files} onTagClick={handleTagClick} />
      </div>
    );
  }
};

const CardsFiltered: React.FC<CardsFilteredProps> = ({ category: type, orderType = OrderType.CounterAlphabetical, isCalender = false }) => {
  return (
    <FilterProvider>
      <CardsFilteredContent category={type} orderType={orderType} isCalender={isCalender} />
    </FilterProvider>
  );
};

export default CardsFiltered;
