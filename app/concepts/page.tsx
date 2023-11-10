"use client"

import React from 'react';
import EntityList from '@/components/layout/EntityList';
import useEntityData from '@/hooks/useEntityData';
import Loading from '@/components/util/view/Loading';

const ConceptPage: React.FC = () => {
  const entityType = 'concepts';
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

export default ConceptPage;
