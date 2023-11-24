
import { useEffect, useState } from 'react';
import axios from 'axios';

const useEntityData = (entityType: string, filter: string[] | null) => {
  const [entityData, setEntityData] = useState<any[] | null>(null);

  useEffect(() => {
    if (!entityType) {
      return;
    }

    const fetchEntityData = async () => {
      try {
        // http://localhost:3000/api/entity
        let filter_string = filter ? filter.join(',') : '';
        if (filter_string === '') {
          filter_string = 'all';
        }
        let url = `${process.env.NEXT_PUBLIC_API_URL}/entities?entity_type=${entityType}&filter=${filter_string}`;

        // let url = 'http://localhost:3000/api/entities?entity_type='creative'&filter='artist, album''
        const response = await axios.get(url);
        setEntityData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEntityData();
  }, [entityType, filter]);


  return entityData;
};

export default useEntityData;
