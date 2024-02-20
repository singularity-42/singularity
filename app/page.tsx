import React from 'react';
import { OrderType } from '@/types';

import { useEffect } from 'react';
import CardsFiltered from '@/components/layout/CardsFiltered';

export default function Home() {
  return (
    <CardsFiltered isCalender={true} category="collaborations" orderType={OrderType.CounterAlphabetical} />
  );
}
