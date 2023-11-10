"use client"

import React from 'react';
import EntityList from '@/components/layout/EntityList';
import useEntityData from '@/hooks/useEntityData';
import Loading from '@/components/util/view/Loading';

const collaborationPage: React.FC = () => {
  const entityType = 'collaborations';
  const entityData = useEntityData(entityType);

  if (!entityData) {
    return <Loading />
  }

  return (
    <div>
        <EntityList entityData={entityData} />
    </div>
  );
};

export default collaborationPage;
