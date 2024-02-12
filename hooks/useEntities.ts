"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

interface UseEntitiesResult {
  entities: any[] | null;
  loading: boolean;
  error: string | null;
}

const useEntities = (type: string, filter: string[] = [], name?: string): UseEntitiesResult => {
  const [entities, setEntities] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previousFilter, setPreviousFilter] = useState<string[]>([]);

  useEffect(() => {
    if (type && filter !== previousFilter) {
      setPreviousFilter(filter);
    } else {
      return;
    }

    const fetchEntities = async () => {
      try {
        setLoading(true);
        setError(null);

        let filterString = filter ? filter.join(',') : '';

        let entity_type_string = `entity_type=${type}`;
        let entity_filter_string = filterString ? `filter=${filterString}` : '';

        let url = `${process.env.NEXT_PUBLIC_API_URL}` + `entities?${entity_type_string}`;

        if (entity_filter_string) {
          url = `${url}&${entity_filter_string}`;
        }

        const response = await axios.get(url);
        let _entities = response.data;
        _entities.map((entity: any, index: number) => {
          entity.index = index;
          return entity;
        });
        // filter by name
        if (name && name.length > 0) {
          _entities = _entities.filter((entity: any) => entity.metadata.title.toLowerCase().includes(name.toLowerCase()));
        }
        setEntities(_entities);
      } catch (error) {
        setError('Error fetching entities');
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, [type, filter, name]);

  return { entities, loading, error };
};

export default useEntities;
