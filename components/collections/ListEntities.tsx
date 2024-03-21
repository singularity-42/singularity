"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./ListEntities.module.scss";
import useEntities from "@/hooks/useEntities";
import { useVisual } from "@/hooks/useVisual";
import { useFilter } from "@/hooks/useFilter";

import { ViewType } from "@/app/defaults";
import { MdQuestionMark } from "react-icons/md";
import EntityCardCalendar from "../layouts/EntityCardCalendar";
import EntityCardsColumn from "../layouts/EntityCardsColumn";
import EntityCardCarousel from "../layouts/EntityCardCarousel";
import EntityCardConnections from "../layouts/EntityCardConnections";
import EntityFilter from "../layouts/EntityFilter";
import Loading from "../base/Loading";

const Entities: React.FC = () => {
  const { loading, error } = useEntities();
  const { setTooltip, setMode, mode } = useVisual();

  const ViewComponent = {
    [ViewType.CardsCalender]: EntityCardCalendar,
    [ViewType.CardsColumn]: EntityCardsColumn,
    [ViewType.CardsCarousel]: EntityCardCarousel,
    // [ViewType.CardsConnections]: EntityCardConnections,
  }[mode];

  return (
    <div className={styles.filterCardsContainer}>
      <EntityFilter/>
      <div className={styles.cardsContainer}>
        <ViewComponent />
      </div>
    </div>
  )
}

export default Entities;

