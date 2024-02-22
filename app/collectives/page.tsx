"use client"

import { useFilter } from '@/hooks/provider/FilterProvider';
import React, { useEffect } from 'react';

const CollectivePage: React.FC = () => {
  const filter = 'collectives';
  const { setFilterCategory } = useFilter();

  useEffect(() => {
    setFilterCategory(filter);
  }, []);

  return <></>;
};

export default CollectivePage;
