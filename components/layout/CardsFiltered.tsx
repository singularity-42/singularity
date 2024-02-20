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

const CardsFilteredContent: React.FC<CardsFilteredProps> = ({
  category,
  orderType = OrderType.CounterAlphabetical,
  isCalender,
}) => {
  const [datedFiles, setDatedFiles] = useState<{ [date: string]: any[] }>({});

  const { filter, setFilterTags, setFilterCategory, setFilterDate, setFilterName, setFilterConnections } = useFilter();
  const { files, loading, error } = useFiles(category, filter.tags);
  const { setTooltip } = useTooltip();

  useEffect(() => setTooltip(`${category} - ${TYPE_DESCRIPTIONS[category]}`), [category]);

  useEffect(() => {
    if (files && orderType === OrderType.Alphabetical) files.sort((a, b) => a.name.localeCompare(b.name));
    if (files && orderType === OrderType.Random) files.sort(() => Math.random() - 0.5);
    if (files && orderType === OrderType.CounterAlphabetical) files.sort((a, b) => b.name.localeCompare(a.name));
  }, [orderType]);

  const sortByDate = (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime();

  const sortedDates = useMemo(() => Object.keys(datedFiles).sort(sortByDate), [datedFiles]);

  useEffect(() => {
    if (!files || !isCalender) return;

    const updatedDatedFiles: { [date: string]: any[] } = {};

    files.forEach((file) => {
      const date = file.date.split(/-/gm).reverse().join(".");
      updatedDatedFiles[date] ? updatedDatedFiles[date].push(file) : (updatedDatedFiles[date] = [file]);
    });

    Object.keys(updatedDatedFiles).forEach((date) => {
      updatedDatedFiles[date].sort((a, b) => (orderType === OrderType.CounterAlphabetical ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    });

    setDatedFiles(updatedDatedFiles);
  }, [files, isCalender, orderType]);

  const handleTagClick = (tag: string) => tag.length >= 1 && setFilterTags(filter.tags.includes(tag) ? filter.tags.filter((t: string) => t !== tag) : [...filter.tags, tag]);

  if (loading) return <Loading />;
  if (error) return <p> Error: {error || "unknown"} </p>;
  if (!files) return null;

  return (
    <div className={styles.filterCardsContainer}>
      <Filter
        files={files}
        filter={filter}
        setFilterTags={setFilterTags}
        setFilterCategory={setFilterCategory}
        setFilterDate={setFilterDate}
        setFilterName={setFilterName}
        setFilterConnections={setFilterConnections}
      />
      {isCalender ? (
        sortedDates.map((date, index) => (
          <div key={date} className={styles.calendarItem}>
            <div className={styles.dateInfo}>
              <DateComponent date={date} />
            </div>
            <div className={styles.cardsContainer}>
              <Cards files={datedFiles[date]} onTagClick={handleTagClick} />
            </div>
          </div>
        ))
      ) : (
        <Cards files={files} onTagClick={handleTagClick} />
      )}
    </div>
  );
};

const CardsFiltered: React.FC<CardsFilteredProps> = ({ category: type, orderType = OrderType.CounterAlphabetical, isCalender = false }) => (
  <FilterProvider>
    <CardsFilteredContent category={type} orderType={orderType} isCalender={isCalender} />
  </FilterProvider>
);

export default CardsFiltered;