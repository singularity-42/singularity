"use client"

import React, { useEffect } from 'react';
import { useFilter } from '@/hooks/provider/FilterProvider';

const CreativesPage: React.FC = () => {
  const filter = 'creatives';
  const { setFilterCategory } = useFilter();

  useEffect(() => {
    console.log('useEffect');
    setFilterCategory(filter);
  }, []);

  return <></>;
};

export default CreativesPage;
