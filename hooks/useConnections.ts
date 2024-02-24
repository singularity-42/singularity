import { useEffect, useState } from 'react';
import axios from 'axios';
import { Connection } from '@/types';
import { useCredentials } from './provider/CredentialsProvider';
import { Edge, Node } from 'vis-network';

const useConnections = (names: string[]) => {
    const [connections, setConnections] = useState<Connection>({
        title: 'Merged Connections',
        nodes: [],
        edges: [],
    });
    const { credentials } = useCredentials();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConnections = async () => {
            setLoading(true);
            try {
                const requests = names.map(async (name) => {
                    const url = `${process.env.NEXT_PUBLIC_API_URL}` + `connections?name=${name}`;
                    const response = await axios.get(url, {
                        headers: {
                            'Authorization': `Dusk ${credentials.join(':')}`
                        },
                    });
                    return response.data;
                });

                const results = await Promise.all(requests);
                const uniqueNodeIds = new Set<string>();
                const mergedNodes: Node[] = [];
                const mergedEdges: Edge[] = [];

                results.forEach((result) => {
                    result.nodes.forEach((node: Node) => {
                        // Only add unique nodes
                        let id = (node.id || -1).toString();
                        if (!uniqueNodeIds.has(id)) {
                            uniqueNodeIds.add(id);
                            mergedNodes.push(node);
                        }
                    });

                    result.edges.forEach((edge: Edge) => {
                        if (!mergedEdges.some((mergedEdge) => mergedEdge.id === edge.id)) {
                            mergedEdges.push(edge);
                        }
                    });
                });

                setConnections({
                    title: 'Merged Connections',
                    nodes: mergedNodes,
                    edges: mergedEdges,
                });
            } catch (error) {
                setError((error as string) || 'Unknown error');
                setConnections({
                    title: 'Loading',
                    nodes: [],
                    edges: [],
                });
            }
            setLoading(false);
        };

        if (names.length > 0) {
            fetchConnections();
        } else {
            // Handle the case when there are no names
            setConnections({
                title: 'Merged Connections',
                nodes: [],
                edges: [],
            });
            setLoading(false);
            setError('No names provided');
        }
    }, [names, credentials]);

    return {
        connections,
        loading,
        error
    };
}

export default useConnections;
