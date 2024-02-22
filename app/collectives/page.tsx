"use client"

import { useFilter } from '@/hooks/provider/FilterProvider';
import { CategoryType } from '@/types';
import React, { useEffect } from 'react';

const CollectivePage: React.FC = () => {
  const { setFilterCategory } = useFilter();

  useEffect(() => {
    setFilterCategory(CategoryType.Collective);
  }, []);


  return <></>;
};

export default CollectivePage;
