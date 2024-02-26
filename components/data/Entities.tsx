"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./Entities.module.scss";
import useFiles from "@/hooks/useFiles";
import Loading from "../content/Loading";
import { useVisual } from "@/hooks/provider/VisualProvider";
import { useFilter } from "@/hooks/provider/FilterProvider";
import Filter from "../util/Filter";

import EntityCardsColumn from "./EntityCardsColumn";
import EntityCardCarousel from "./EntityCardCarousel";
import EntityCardCalendar from "./EntityCardCalendar";
import EntityCardConnections from "./EntityCardConnections";
import { ViewMode } from "@/types";
import { MdQuestionMark } from "react-icons/md";

interface EntitiesProps {
}

// view types:
/*
 - Cards Calender
 - Cards Column
 - Cards Carousel 
 - Cards Connections (Graph)
*/

const Entities: React.FC<EntitiesProps> = ({
}) => {

  const { filter, setFilterTag, setFilterCategory, setFilterDate, setFilterName, setFilterConnection } = useFilter();
  const { files, loading, error } = useFiles(filter);
  const [name, setName] = useState<string>("");
  const { setTooltip, setMode, mode } = useVisual();

  useEffect(() => {
  }, [name]);

  const handleTagClick = (tag: string) => tag && setFilterTag(tag);

  const ViewComponent = {
    [ViewMode.CardsCalender]: EntityCardCalendar,
    [ViewMode.CardsColumn]: EntityCardsColumn,
    [ViewMode.CardsCarousel]: EntityCardCarousel,
    [ViewMode.CardsConnections]: EntityCardConnections,
  }[mode];

  return (
    <div className={styles.filterCardsContainer}>
      <Filter
        files={files || []}
        filter={filter}
        setFilterTag={setFilterTag}
        setFilterCategory={setFilterCategory}
        setFilterDate={setFilterDate}
        setFilterName={setFilterName}
        setFilterConnection={setFilterConnection}
      />

      {/* {loading ? <Loading /> : ((
        <Cards files={(!filter.name ? files : (files || []).filter(file => file.name.includes(filter.name))) || []} onTagClick={handleTagClick} />
      ))} */}
      {loading ? <Loading /> : (files?.length === 0 ? <div className={styles.noResults}><MdQuestionMark /></div> : (
        <div className={styles.cardsContainer}>
          <ViewComponent files={(files) || []} onTagClick={handleTagClick} />
        </div>
      ))}
    </div>
  )
}

export default Entities;
