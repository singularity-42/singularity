// Categories

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCredentials } from './provider/useCredentials';

const useCategories = () => {
    const [ categories, setCategories ] = useState<string[]>([]);
    const { credentials } = useCredentials();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchRelation = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL}categories`
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Dusk ${credentials.join(':')}`
                    },
                });
                setCategories(response.data);
            } catch (error) {
                setError((error as string) || 'Unknown error');
                setCategories([]);
            }
            setLoading(false);
        };
        fetchRelation();
    }, []);

    return {
        categories,
        loading, 
        error
    };
}

export default useCategories;
