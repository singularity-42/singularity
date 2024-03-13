"use client"

import { useFilter } from '@/hooks/provider/useFilter';
import { useVisual } from '@/hooks/provider/useVisual';
import { CategoryType, ViewType } from '../../defaults';
import React, { useEffect } from 'react';

const CollectivePage: React.FC = () => {
  const { setFilterCategory } = useFilter();
  const { setMode } = useVisual();

  useEffect(() => {
    setMode(ViewType.CardsColumn)
    setFilterCategory(CategoryType.Collective);
  }, []);


  return <></>;
};

export default CollectivePage;
