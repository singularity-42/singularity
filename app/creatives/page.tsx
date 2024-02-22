"use client"

import React, { useEffect } from 'react';
import { useFilter } from '@/hooks/provider/FilterProvider';
import { CategoryType } from '@/types';

const CreativePage: React.FC = () => {
  const { setFilterCategory } = useFilter();

  useEffect(() => {
    setFilterCategory(CategoryType.Creative);
  }, []); 

  return (
    <></>
  );
};


export default CreativePage;
