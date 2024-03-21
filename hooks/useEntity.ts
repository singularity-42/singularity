import { useEffect, useState } from 'react';
import axios from 'axios';
import { FileContent, Filter } from '@/app/types';
import { useCredentials } from './provider/useCredentials';

const useEntity = (filter: Filter) => {
    const { name, date } = filter;
    
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { credentials, addCredentials} = useCredentials();
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
                        'Content-Type': 'application/json',
                        'Authorization': `Dusk ${credentials.join(':')}`
                    }
                });
                if (response.status !== 200) {
                    setError('Error saving file');
                    return;
                }
                const savedFileContent: FileContent = response.data.file;
                const newCredentials: string = response.data.credentials;
                addCredentials(newCredentials);
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
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}` + `entity?name=${name}${date ? `&date=${date}` : ''}`, { headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Dusk ${credentials.join(':')}`
                }});
                setFile(response.data);
            } catch (error) {
                setError((error as string) || 'Unknown error');
                setFile(null);
            }
            setLoading(false);
        };

        fetchFileContent();
    }, [name, credentials]);

    return {
        file,
        loading,
        error,
        update,
        save
    };
}

export default useEntity;