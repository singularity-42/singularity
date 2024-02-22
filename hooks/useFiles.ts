import { useEffect, useState } from 'react';
import axios from 'axios';
import { Filter } from '@/types';
import { useCredentials } from './provider/CredentialsProvider';

interface UseFilesResult {
  files: any[] | null;
  loading: boolean;
  error: string | null;
}

const useFiles = (filter: Filter): UseFilesResult => {
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

        const tagFilterString = tagsString ? `tags=${tagsString}` : '';
        const nameFilterString = nameString ? `name=${nameString}` : '';
        const categoryFilterString = `category=${filter.category}`;
        const connectionFilterString = `connections=${connectionsString}`;

        const url = `${process.env.NEXT_PUBLIC_API_URL}/files?${(filter.tags|| []).length > 0 ? '&' + tagFilterString : ''}${(filter.connections || []).length > 0 ? '&' + connectionFilterString : ''}${(filter.category|| []).length > 0 ? '&' + categoryFilterString : ''}${(filter.name|| []).length > 0 ? '&' + nameFilterString : ''}`;

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

export default useFiles;
