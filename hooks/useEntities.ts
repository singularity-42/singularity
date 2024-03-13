import { useEffect, useState } from 'react';
import axios from 'axios';
import { Filter } from '@/app/types';
import { useCredentials } from './provider/useCredentials';

interface UseEntitiesResult {
  files: any[] | null;
  loading: boolean;
  error: string | null;
}

const useEntities = (filter: Filter): UseEntitiesResult => {
  const [files, setFiles] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { credentials } = useCredentials();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const tagsString = filter.tags?.join(',') ?? '';
        const connectionsString = filter.connections?.join(',') ?? '';
        const nameString = filter.name ?? '';
        const categoryString = filter.category ?? '';

        if (`${tagsString}${connectionsString}${nameString}${categoryString}` === '') {
          setLoading(false);
          return;
        }


        const url = `${process.env.NEXT_PUBLIC_API_URL}/entities?tags=${tagsString}&connections=${connectionsString}&category=${filter.category}&name=${nameString}`;


        const response = await axios.get(url, {
          headers: {
            Authorization: `Dusk ${credentials.join(':')}`,
          },
        });

        setFiles(response.data);
      } catch (error) {
        setError('Error fetching files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [filter, credentials]); // Include credentials in the dependency array

  return { files, loading, error };
};

export default useEntities;
