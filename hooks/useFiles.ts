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

        const filterString = filter.tags?.join(',') ?? '';
        const categoryString = `category=${filter.category}`;
        const fileFilterString = filterString ? `filter=${filterString}` : '';

        const url = `${process.env.NEXT_PUBLIC_API_URL}/files?${categoryString}${fileFilterString ? '&' + fileFilterString : ''}`;

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
