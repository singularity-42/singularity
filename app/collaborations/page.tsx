"use client"

import React, { useEffect } from 'react';
import { useFilter } from '@/hooks/provider/FilterProvider';
import { CategoryType } from '@/types';

const collaborationPage: React.FC = () => {
  const { setFilterCategory } = useFilter();

  useEffect(() => {
    setFilterCategory(CategoryType.Collaboration);
  }, []);
  return <></>;
};

export default collaborationPage;
