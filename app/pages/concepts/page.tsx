"use client"

import { useFilter } from '@/hooks/useFilter';
import { useVisual } from '@/hooks/useVisual';
import { CategoryType, ViewType } from '../../defaults';
import React, { useEffect } from 'react';
import ListEntities from '@/components/collections/ListEntities';

const ConceptPage: React.FC = () => {
  const { setFilterCategory } = useFilter();
  const { setMode } = useVisual();

  useEffect(() => {
    setMode(ViewType.CardsColumn)
    setFilterCategory(CategoryType.Concept);
  }, []);


  return <ListEntities />;
}

export default ConceptPage;
