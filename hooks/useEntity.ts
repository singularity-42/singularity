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
        const fetchEntity = async () => {
            console.log('Fetching entity:', name);

            if (!name) {
                return;
            }

            if (name.length > 0)
                return;


            try {
                // Construct the API URL properly
                const url = `${process.env.NEXT_PUBLIC_API_URL}/entity?name=${name}`;
                // Fetch data from the API
                const response = await axios.get(url);

                // Assuming the API returns data in the expected format
                setEntity(response.data);
            } catch (error) {
                console.error('Error fetching entity:', error);
                setEntity(
                    {
                        title: '',
                        tags: [],
                        description: '',
                    }
                );
            }
        };



        fetchEntity();
    }, [name]);

    return { entity };
}

export default useEntity;
