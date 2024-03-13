"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./ListEntities.module.scss";
import useEntities from "@/hooks/useEntities";
import { useVisual } from "@/hooks/provider/useVisual";
import { useFilter } from "@/hooks/provider/useFilter";

import { ViewType } from "@/app/defaults";
import { MdQuestionMark } from "react-icons/md";
import EntityCardCalendar from "../layouts/EntityCardCalendar";
import EntityCardsColumn from "../layouts/EntityCardsColumn";
import EntityCardCarousel from "../layouts/EntityCardCarousel";
import EntityCardConnections from "../layouts/EntityCardConnections";
import EntityFilter from "../layouts/EntityFilter";
import Loading from "../base/Loading";

const Entities: React.FC = () => {

  const { filter, setFilterTag, setFilterCategory, setFilterDate, setFilterName, setFilterConnection } = useFilter();
  const { files, loading, error } = useEntities(filter);
  const [name, setName] = useState<string>("");
  const { setTooltip, setMode, mode } = useVisual();

  useEffect(() => {
  }, [name]);

  const handleTagClick = (tag: string) => tag && setFilterTag(tag);

  const ViewComponent = {
    [ViewType.CardsCalender]: EntityCardCalendar,
    [ViewType.CardsColumn]: EntityCardsColumn,
    [ViewType.CardsCarousel]: EntityCardCarousel,
    // [ViewType.CardsConnections]: EntityCardConnections,
  }[mode];

  return (
    <div className={styles.filterCardsContainer}>
      <EntityFilter
        files={files || []}
        filter={filter}
        setFilterTag={setFilterTag}
        // setFilterCategory={setFilterCategory}
        setFilterDate={setFilterDate}
        setFilterName={setFilterName}
        setFilterConnection={setFilterConnection}
      />
      <div className={styles.cardsContainer}>
        <ViewComponent files={(files) || []} onTagClick={handleTagClick} />
      </div>
    </div>
  )
}

export default Entities;

