"use client"

import React, { useEffect } from 'react';
import { useFilter } from '@/hooks/provider/useFilter';
import { useVisual } from '@/hooks/provider/useVisual';
import { CategoryType, ViewType } from '../../defaults';

const CreativePage: React.FC = () => {
  const { setFilterCategory } = useFilter();
  const { setMode } = useVisual();

  useEffect(() => {
    setMode(ViewType.CardsCarousel)
    setFilterCategory(CategoryType.Creative);
  }, []); 

  return (
    <></>
  );
};


export default CreativePage;
