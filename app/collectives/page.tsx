"use client"

import { useFilter } from '@/hooks/provider/FilterProvider';
import { useVisual } from '@/hooks/provider/VisualProvider';
import { CategoryType, ViewMode } from '@/types';
import React, { useEffect } from 'react';

const CollectivePage: React.FC = () => {
  const { setFilterCategory } = useFilter();
  const { setMode } = useVisual();

  useEffect(() => {
    setMode(ViewMode.CardsColumn)
    setFilterCategory(CategoryType.Collective);
  }, []);


  return <></>;
};

export default CollectivePage;
