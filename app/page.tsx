"use client"

import React, { useEffect } from 'react';
import { useFilter } from '@/hooks/provider/FilterProvider';

export default function Home() {
  const filter = 'collaborations';
  const { setFilterCategory } = useFilter();

  useEffect(() => {
    setFilterCategory(filter);
  }, []);



  return <></>;
}
