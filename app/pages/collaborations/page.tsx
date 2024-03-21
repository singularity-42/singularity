"use client"

import React, { useEffect } from 'react';
import { useFilter } from '@/hooks/useFilter';
import { CategoryType, ViewType } from '../../defaults';
import { useVisual } from '@/hooks/useVisual';
import ListEntities from '@/components/collections/ListEntities';

const collaborationPage: React.FC = () => {
  const { setFilterCategory } = useFilter();
  const { setMode } = useVisual();

  useEffect(() => {
    setMode(ViewType.CardsCalender)
    setFilterCategory(CategoryType.Collaboration);
  }, []);
  
  return <ListEntities />;
};

export default collaborationPage;
