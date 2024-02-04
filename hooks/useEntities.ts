
import { useEffect, useState } from 'react';
import axios from 'axios';

const useEntities = (type: string, filter: string[]) => {
  const [entities, setEntities] = useState<any[] | null>(null);
  const [previousFilter, setPreviousFilter] = useState<string[] | null>([]);
  const [previousType, setPreviousType] = useState<string>('');

  useEffect(() => {
    // TODO: this will called like infinite times because of the filter update and creating a loop of updates
    if (type && (filter != previousFilter || type != previousType)){
      setPreviousFilter(filter);
      setPreviousType(type);
    }else return;

    const fetchEntities = async () => {
      try {
        // http://localhost:3000/api/entity
        let filter_string = filter ? filter.join(',') : '';
        if (filter_string === '') {
          filter_string = '';
        }

        let entity_type_string = `entity_type=${type}`;
        let entity_filter_string = `filter=${filter_string}`;

        let url = `${process.env.NEXT_PUBLIC_API_URL}`+`entities?${entity_type_string}`;

        if (filter_string.length > 0)
          url = `${url}&${entity_filter_string}`

        // let url = 'http://localhost:3000/api/entities?entity_type='creative'&filter='artist, album''
        const response = await axios.get(url);
        setEntities(response.data);
      } catch (error) {
      }
    };

    fetchEntities();
  }, [type, filter]);

  // map entites with propetiy index and number them
  if (entities) {
    entities.map((entity, index) => {
      entity.index = index;
      return entity;
    });
  }
  return entities;
};

export default useEntities;
