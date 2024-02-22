import { useFilter } from '@/hooks/provider/FilterProvider';
import React from 'react';

const ConceptPage: React.FC = () => {
  const filter = 'concepts';
  const { setFilterCategory } = useFilter();
  setFilterCategory(filter);
  return <></>;
};


export default ConceptPage;
