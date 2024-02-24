"use client"

import React, { useEffect } from 'react';
import { useFilter } from '@/hooks/provider/FilterProvider';
import { CategoryType, ViewMode } from '@/types';
import { useVisual } from '@/hooks/provider/VisualProvider';

const collaborationPage: React.FC = () => {
  const { setFilterCategory } = useFilter();
  const { setMode } = useVisual();

  useEffect(() => {
    setMode(ViewMode.CardsCalender)
    setFilterCategory(CategoryType.Collaboration);
  }, []);
  return <></>;
};

export default collaborationPage;
