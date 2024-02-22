import { useEffect, useState } from 'react';
import axios from 'axios';
import { Connection } from '@/types';
import { useCredentials } from './provider/CredentialsProvider';

const useConnection = (name: string) => {
    const [connection, setConnection] = useState<Connection>({
        title: '',
        nodes: [],
        edges: [],
    }
    );

    const { credentials } = useCredentials();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchRelation = async () => {
            if (!name) return;
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL}`+`connections?name=${name}`;
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Dusk ${credentials.join(':')}`
                    },
                });
                setConnection(response.data);
            } catch (error) {
                setError((error as string) || 'Unknown error');
                setConnection(
                    {
                        title: 'Loading',
                        nodes: [],
                        edges: [],
                    }
                );
            }
            setLoading(false);
        };
        fetchRelation();
    }, [name]);

    return {
        connection, 
        loading, 
        error
    };
}

export default useConnection;
