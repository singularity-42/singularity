"use client"

import React, { useEffect } from 'react';
import { useFilter } from '@/hooks/provider/FilterProvider';
import { CategoryType } from '@/types';

export default function Home() {
  const { setFilterCategory } = useFilter();

  useEffect(() => {
    setFilterCategory(CategoryType.Collaboration);
  }, []);


  return <></>;
};
