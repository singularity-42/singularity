"use client";

import Title from '@/components/base/Title';
import Markdown from '@/components/layout/Markdown';
import Table from '@/components/layout/Table';
import useEntity from '@/hooks/useEntity';
import React from 'react';

const ContactPage: React.FC = () => {
  // useEntity('Contact');
  const {
    entity, 
    loading, 
    error
} = useEntity('Singularity.md');


  return (
    <div style={
      // info block 
      {
        position: 'absolute',
        display: 'flex',
        fontSize: '18px',
        top: '33%',
        padding: '50px',
        gap: '20px',
        color: '#ccc',

      }
    }
    >
      <Markdown content={entity?.content || 'not loaded'} />
    </div>
  );
};

export default ContactPage;
