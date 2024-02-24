"use client"

import React, { useEffect } from 'react';
import { useFilter } from '@/hooks/provider/FilterProvider';
import { CategoryType, ViewMode } from '@/types';
import { useVisual } from '@/hooks/provider/VisualProvider';

export default function Home() {
  const { setFilterCategory } = useFilter();
  const { setMode } = useVisual();

  useEffect(() => {
    setMode(ViewMode.CardsCalender)
    setFilterCategory(CategoryType.Collaboration);
  }, []);


  return <></>;
};
