"use client"

import React, { useEffect } from "react";
import { useFilter } from "@/hooks/provider/FilterProvider";
import { CategoryType } from "@/types";

const ChangePage: React.FC = () => {
  const { setFilterCategory } = useFilter();

  useEffect(() => {
    setFilterCategory(CategoryType.Change);
  }, []);


return <></>;
};

export default ChangePage;
