import React from 'react';
import { OrderType } from '@/types';
import Calendar from '@/components/view/Calendar';

const collaborationPage: React.FC = () => {
  return (
      <Calendar type="collaborations" orderType={OrderType.CounterAlphabetical} />
      
  );
};

export default collaborationPage;
