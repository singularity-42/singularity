"use client"

import React, { useEffect } from "react";
import { useFilter } from "@/hooks/provider/useFilter";
import { CategoryType, ViewType } from '../../defaults';
import { useVisual } from "@/hooks/provider/useVisual";

const ChangePage: React.FC = () => {
  const { setFilterCategory } = useFilter();
  const { setMode } = useVisual();

  useEffect(() => {
    setMode(ViewType.CardsColumn)
    setFilterCategory(CategoryType.Change);
  }, []);


return <></>;
};

export default ChangePage;
