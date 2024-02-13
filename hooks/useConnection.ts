import { useEffect, useState } from 'react';
import axios from 'axios';
import { Connection } from '@/types';


const useConnection = (name: string) => {
    const [connection, setConnection] = useState<Connection>({
        title: '',
        nodes: [],
        edges: [],
    }
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     setLoading(true);
    //     const fetchRelation = async () => {
            
    //         if (!name) {
    //             return;
    //         }


    //         try {
    //             // Construct the API URL properly
    //             const url = `${process.env.NEXT_PUBLIC_API_URL}`+`connections?name=${name}`;
    //             // Fetch data from the API
    //             const response = await axios.get(url);
    //             // Assuming the API returns data in the expected format
    //             setConnection(response.data);
    //         } catch (error) {
    //             setError((error as string) || 'Unknown error');
    //             setConnection(
    //                 {
    //                     title: '',
    //                     nodes: [],
    //                     edges: [],
    //                 }
    //             );
    //         }
    //         setLoading(false);
    //     };



    //     fetchRelation();
    // }, [name]);

    return {
        connection, 
        loading, 
        error
    };
}

export default useConnection;
