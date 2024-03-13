"use client"

import { useFilter } from '@/hooks/provider/useFilter';
import { useVisual } from '@/hooks/provider/useVisual';
import { CategoryType, ViewType } from '../../defaults';
import React, { useEffect } from 'react';

const ConceptPage: React.FC = () => {
  const { setFilterCategory } = useFilter();
  const { setMode } = useVisual();

  useEffect(() => {
    setMode(ViewType.CardsColumn)
    setFilterCategory(CategoryType.Concept);
  }, []);


  return <></>;
}

export default ConceptPage;
