"use client"

import React, { useEffect } from 'react';
import { useFilter } from '@/hooks/useFilter';
import { useVisual } from '@/hooks/useVisual';
import { CategoryType, ViewType } from './defaults';

const collaborationPage: React.FC = () => {
  const { setFilterCategory } = useFilter();
  const { setMode } = useVisual();

  useEffect(() => {
    setMode(ViewType.CardsCalender)
    setFilterCategory(CategoryType.Collaboration);
  }, []);
  return <></>;
};

export default collaborationPage;
