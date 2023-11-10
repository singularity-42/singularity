"use client"

import React from 'react';
import CreativesList from '@/components/util/CreativesList';
import useEntityData from '@/hooks/useEntityData';

interface EntityData {
  title: string;
  children: string;
  metadata: {
    website: string;
    instagram: string;
    mail: string;
    tel: string;
    tags: string[];
  };
}

const CreativesPage: React.FC = () => {
  const entityType = 'creatives';
  const entityData = useEntityData(entityType);

  if (!entityData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <CreativesList entityData={entityData} />
    </div>
  );
};

export default CreativesPage;
