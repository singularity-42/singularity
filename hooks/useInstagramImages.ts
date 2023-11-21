
import { useEffect, useState } from 'react';
import axios from 'axios';

const useInstagramImages = (username: string): any[] | null => {
    const [imagesList, setImageList] = useState<any[] | null>(null);

    useEffect(() => {
        console.log('useInstagramImages: useEffect');

        if (!username) {
            return;
        }

        const fetchImages = async () => {
            try {
                let url = process.env.NEXT_PUBLIC_API_URL + 'instagram';
                const response = await axios.get(url);
                setImageList(response.data);
               } catch (error) {
                console.error(error);
               }
        }

        fetchImages();

    }, [username]);

    return imagesList;

};

export default useInstagramImages;

