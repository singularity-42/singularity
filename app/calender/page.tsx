import React from 'react';
import TableContent from '@/components/layout/Table';
import { OrderType } from '@/types';

const collaborationPage: React.FC = () => {
  return (
      <TableContent type='collaborations' orderType={OrderType.Alphabetical} />
      
  );
};

export default collaborationPage;
