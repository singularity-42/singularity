import { useEffect, useState } from 'react';
import axios from 'axios';

const useEntity = (name: string) => {
    const [entity, setEntity] = useState<any | null>(null);

    useEffect(() => {
        const fetchEntity = async () => {
            if (!name) {
                return;
            }

            try {
                console.log('Fetching entity:', name);
                // Construct the API URL properly
                const url = `${process.env.NEXT_PUBLIC_API_URL}/entity?name=${name}`;
                console.log('URL:', url);
                // Fetch data from the API
                const response = await axios.get(url);
                
                // Assuming the API returns data in the expected format
                setEntity(response.data);
            } catch (error) {
                console.error('Error fetching entity:', error);
                setEntity(null); // Optionally handle errors or set a default value
            }
        };

        fetchEntity();
    }, [name]);

    return entity;
}

export default useEntity;
