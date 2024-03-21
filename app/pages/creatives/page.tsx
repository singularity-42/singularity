"use client"

import React, { useEffect } from 'react';
import { useFilter } from '@/hooks/useFilter';
import { useVisual } from '@/hooks/useVisual';
import { CategoryType, ViewType } from '../../defaults';
import ListEntities from '@/components/collections/ListEntities';

const CreativePage: React.FC = () => {
  const { setFilterCategory } = useFilter();
  const { setMode } = useVisual();

  useEffect(() => {
    setMode(ViewType.CardsCarousel)
    setFilterCategory(CategoryType.Creative);
  }, []); 

  return <ListEntities />;
};


export default CreativePage;
