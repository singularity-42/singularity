
import { useEffect, useState } from 'react';
import axios from 'axios';

const useEntityData = (entityType: string): any[] | null => {
  const [entityData, setEntityData] = useState<any[] | null>(null);

  useEffect(() => {
    if (!entityType) {
      return;
    }

    const fetchEntityData = async () => {
      try {
        // http://localhost:3000/api/entity
        let url = `${process.env.NEXT_PUBLIC_API_URL}/entities?entity_type=${entityType}`;
        // let url = 'http://localhost:3000/api/entity'
        const response = await axios.get(url);
        setEntityData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEntityData();
  }, [entityType]);


  return entityData;
};

export default useEntityData;
