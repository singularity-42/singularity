import React from 'react';
import Table from '@/components/layout/Table';
import { OrderType } from '@/types';

const collaborationPage: React.FC = () => {
  return (
      <Table type='collaborations' orderType={OrderType.Alphabetical} />
      
  );
};

export default collaborationPage;
