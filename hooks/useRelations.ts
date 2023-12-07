import { useEffect, useState } from 'react';
import axios from 'axios';
import { Relation } from '@/types';


const useRelation = (name: string) => {
    const [relations, setRelation] = useState<Relation>({
        title: '',
        nodes: [],
        edges: [],
    }
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchRelation = async () => {
            
            if (!name) {
                return;
            }


            try {
                // Construct the API URL properly
                const url = `${process.env.NEXT_PUBLIC_API_URL}`+`relations?name=${name}`;
                // Fetch data from the API
                const response = await axios.get(url);
                // Assuming the API returns data in the expected format
                setRelation(response.data);
            } catch (error) {
                setError((error as string) || 'Unknown error');
                setRelation(
                    {
                        title: '',
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
        relations, 
        loading, 
        error
    };
}

export default useRelation;
