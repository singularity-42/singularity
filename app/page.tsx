"use client";

import React from 'react';
import { OrderType } from '@/types';
import Calendar from '@/components/layout/Calendar';

import { useEffect } from 'react';

export default function Home() {
  return (
    <Calendar category="collaborations" orderType={OrderType.CounterAlphabetical} />
    
  );
}
