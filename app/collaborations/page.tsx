import React from 'react';
import { OrderType } from '@/types';
import CardsFiltered from '@/components/layout/CardsFiltered';

const collaborationPage: React.FC = () => {
  return (
      <CardsFiltered calender category="collaborations" orderType={OrderType.CounterAlphabetical} />
      
  );
};

export default collaborationPage;
