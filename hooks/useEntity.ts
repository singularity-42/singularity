import { useEffect, useState } from 'react';
import axios from 'axios';
import { Entity } from '@/types';


const useEntity = (name: string) => {
    const [entity, setEntity] = useState<Entity>({
        title: '',
        tags: [],
        description: '',
    }
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchEntity = async () => {
            
            if (!name) {
                return;
            }

            console.log('Fetching entity:', name);

            try {
                // Construct the API URL properly
                const url = `${process.env.NEXT_PUBLIC_API_URL}`+`entity?name=${name}`;
                // Fetch data from the API
                const response = await axios.get(url);

                // Assuming the API returns data in the expected format
                setEntity(response.data);
            } catch (error) {
                console.error('Error fetching entity:', error);
                setError((error as string) || 'Unknown error');
                setEntity(
                    {
                        title: '',
                        tags: [],
                        description: '',
                    }
                );
            }
            setLoading(false);
        };



        fetchEntity();
    }, [name]);

    return {
        entity, 
        loading, 
        error
    };
}

export default useEntity;
