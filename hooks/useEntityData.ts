
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useFilter } from './provider/FilterProvider';

const useEntityData = (entityType: string) => {
  const [entityData, setEntityData] = useState<any[] | null>(null);
  const { filter } = useFilter();

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
