import useConnections from '@/hooks/useConnections';
import { FileContent } from '@/types';
import React, { useState, useEffect, useMemo } from 'react';
import EntityConnections from './EntityConnections';

interface CardConnectionsProps {
  files: FileContent[];
  onTagClick: (tag: string) => void;
}

const EntityCardConnections: React.FC<CardConnectionsProps> = (props) => {
  const [names, setNames] = useState<string[]>([]);
  const { files } = props;
  const { connections } = useConnections(names);


  // loop all children and display thier names
  useEffect(() => {
    if (!files) return;
    let _names: string[] = [];
    files.forEach((child: any) => {
      if (child.name) {
        _names.push(child.name);
      }
    });
    console.log('_names', _names);
    setNames(_names);
  }, [files]);

  return <EntityConnections connections={connections} />;
};

export default EntityCardConnections;
