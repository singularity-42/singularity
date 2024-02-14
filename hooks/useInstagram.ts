import { useEffect, useState } from 'react';
import axios from 'axios';

const useInstagram = (name: string) => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchFileContent = async () => {
            
            if (!name) {
                return;
            }

            try {
                // Construct the API URL properly
                const url = `${process.env.NEXT_PUBLIC_API_URL}`+`social/instagram?name=${name}`;
                // Fetch data from the API
                const response = await axios.get(url);

                // Assuming the API returns data in the expected format
                setImages(response.data);
            } catch (error) {
                setError((error as string) || 'Unknown error');
                setImages([]);
            }
            setLoading(false);
        };



        fetchFileContent();
    }, [name]);

    return {
        images, 
        loading, 
        error
    };
}

export default useInstagram;
