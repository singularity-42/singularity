
import { useEffect, useState } from 'react';
import axios from 'axios';
import { EntityData } from '@/interfaces';

const useEntityData = (entityType: string): EntityData[] | null => {
  const [entityData, setEntityData] = useState<EntityData[] | null>(null);

  useEffect(() => {
    console.log('entity type:', entityType);
    if (!entityType) {
      return;
    }

    const fetchEntityData = async () => {
      try {
        // http://localhost:3000/api/entity
        let url = `${process.env.NEXT_PUBLIC_API_URL}/entities?entity_type=${entityType}`;
        // let url = 'http://localhost:3000/api/entity'
        console.log('URL:', url);
        const response = await axios.get(url);
        const files = response.data;

        const entityDataArray = files.map((file: any) => {
          console.log('file:', file);
          const content = file.content;
          const metadata = content;
          return { file, metadata };
        }); 

        setEntityData(entityDataArray);
      } catch (error) {
        console.error(error);
      }
    };

    console.log('Fetching entity data...');
    fetchEntityData();
  }, [entityType]);


  return entityData;
};

export default useEntityData;
