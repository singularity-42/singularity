"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

interface UseFilesResult {
  files: any[] | null;
  loading: boolean;
  error: string | null;
}

const useFiles = (category: string, filter: string[] = [], name?: string): UseFilesResult => {
  const [files, setFiles] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previousFilter, setPreviousFilter] = useState<string[]>([]);

  useEffect(() => {
    if (category && filter !== previousFilter) {
      setPreviousFilter(filter);
    } else {
      return;
    }

    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        let filterString = filter ? filter.join(',') : '';

        let category_string = `category=${category}`;
        let file_filter_string = filterString ? `filter=${filterString}` : '';

        let url = `${process.env.NEXT_PUBLIC_API_URL}` + `files?${category_string}`;

        if (file_filter_string) {
          url = `${url}&${file_filter_string}`;
        }

        const response = await axios.get(url);
        let _files = response.data;

        _files.map((file: any, index: number) => {
          file.index = index;
          return file;
        });
        // // filter by name
        // if (name && name.length > 0) {
        //   _files = _files.filter((file: any) => file.name.toLowerCase().includes(name.toLowerCase()));
        // }
        setFiles(_files);
      } catch (error) {
        setError('Error fetching files');
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [category, filter, name]);

  return { files, loading, error };
};

export default useFiles;
