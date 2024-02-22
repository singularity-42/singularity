"use client"

import { useFilter } from '@/hooks/provider/FilterProvider';
import { CategoryType } from '@/types';
import React, { useEffect } from 'react';

const ConceptPage: React.FC = () => {
  const { setFilterCategory } = useFilter();

  useEffect(() => {
    setFilterCategory(CategoryType.Concept);
  }, []);


  return <></>;
}

export default ConceptPage;
