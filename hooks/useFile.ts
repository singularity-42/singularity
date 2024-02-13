import { useEffect, useState } from 'react';
import axios from 'axios';
import { FileContent } from '@/types';


const useFile = (name: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [file, setFile] = useState<FileContent | null>(null);
    const update = (file: FileContent) => {
        setFile(file);
    }

    const save = async () => {
        const saveChanges = async () => {
            setLoading(true);
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}` + `changes`, file, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status !== 200) {
                    setError('Error saving file');
                    return;
                }
                const savedFileContent: FileContent = response.data;
                setFile(savedFileContent);
                if (savedFileContent.name !== '')
                    setError(null);
                else setError('Error saving file');
            }
            catch (error) {
                setError((error as string) || 'Unknown error');
            }
            setLoading(false);
        };
        saveChanges();
    }


    useEffect(() => {
        const fetchFileContent = async () => {
            if (!name) return;
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}` + `file?name=${name}`);
                setFile(response.data);
            } catch (error) {
                setError((error as string) || 'Unknown error');
                setFile(null);
            }
            setLoading(false);
        };

        fetchFileContent();
    }, [name]);

    return {
        file,
        loading,
        error,
        update,
        save
    };
}

export default useFile;
