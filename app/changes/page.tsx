"use client"

import React, { useEffect } from "react";
import { useFilter } from "@/hooks/provider/FilterProvider";

const ChangePage: React.FC = () => {
  const filter = 'changes';
  const { setFilterCategory } = useFilter();

  useEffect(() => {
    setFilterCategory(filter);
  }, []);

  return <></>;
};

export default ChangePage;
