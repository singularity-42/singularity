"use client"

import React from 'react';
import { useFilter } from '@/hooks/provider/FilterProvider';

const collaborationPage: React.FC = () => {
  const filter = 'collaborations';
  const { setFilterCategory } = useFilter();
  setFilterCategory(filter);
  return <></>;
};

export default collaborationPage;
