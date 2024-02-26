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
    const [loadingPercentage, setLoadingPercentage] = useState<number>(0);

    const mergeNodesWithSameLabel = (nodesArray: Node[]): Node[] => {
        const labelMap = new Map<string, Node>();
        nodesArray.forEach((node) => {
            const existingNode = labelMap.get(node.label as string);
            if (existingNode) {
                labelMap.set(node.label as string, { ...existingNode, ...node });
            } else {
                labelMap.set(node.label as string, node);
            }
        });
        return Array.from(labelMap.values());
    };

    const updateNodeIds = (nodesArray: Node[]): Node[] => {
        let currentId =   1;
        const idMap = new Map<string, Node>();
        nodesArray.forEach((node) => {
            const id = currentId.toString();
            idMap.set(id, { ...node, id });
            currentId++;
        });
        return Array.from(idMap.values());
    };

    const updateConnectionsVisibility = (connections: Connection) => {
        const nodes = connections.nodes;
        const edges = connections.edges;

        const nodeMap = new Map<string, Node>();
        const edgeMap = new Map<string, Edge>();

        nodes.forEach((node: Node) => {
            let id = node.id;
            if (!id) {
                id = nodeMap.size.toString();
                node.id = id;
            }
            nodeMap.set(id.toString(), node);
        });

        edges.forEach((edge) => {
            let id = edge.id;
            if (!id) {
                id = edgeMap.size.toString();
                edge.id = id;
            }
            edgeMap.set(id.toString(), edge);
        });

        const nodeIds = Array.from(nodeMap.keys());
        const edgeIds = Array.from(edgeMap.keys());
        const nodeIdMap = new Map<string, boolean>();
        const edgeIdMap = new Map<string, boolean>();

        nodeIds.forEach((id) => {
            nodeIdMap.set(id, true);
        });

        edgeIds.forEach((id) => {
            edgeIdMap.set(id, true);
        });

        nodes.forEach((node) => {
            let id = node.id;
            if (!id) {
                id = nodeMap.size.toString();
                node.id = id;
            }
            if (nodeIdMap.get(id.toString())) {
                node.hidden = false;
            } else {
                node.hidden = true;
            }
        });

        edges.forEach((edge) => {
            let id = edge.id;
            if (!id) {
                id = edgeMap.size.toString();
                edge.id = id;
            }
            if (edgeIdMap.get(id.toString())) {
                edge.hidden = false;
            } else {
                edge.hidden = true;
            }
        });

        setConnections({
            title: connections.title,
            nodes,
            edges,
        });

        setLoading(false);
        setError(null);
        setLoadingPercentage(100);
    };

    useEffect(() => {
        if (connections.nodes.length >   0 && connections.edges.length >   0) {
            updateConnectionsVisibility(connections);
        }
    }, [connections]);

    useEffect(() => {
        const fetchConnections = async () => {
            setLoading(true);
            setLoadingPercentage(0);
            try {
                const results = await Promise.all(names.map(async (name, index) => {
                    const url = `${process.env.NEXT_PUBLIC_API_URL}` + `connections?name=${name}`;
                    const response = await axios.get(url, {
                        headers: {
                            'Authorization': `Dusk ${credentials.join(':')}`
                        },
                    });
                    setLoadingPercentage((index +   1) / names.length *   100);
                    return response.data;
                }));

                const mergedNodes = mergeNodesWithSameLabel(
                    updateNodeIds([...connections.nodes, ...results.flatMap((result) => result.nodes)])
                );

                const mergedEdges = results.flatMap((result) => {
                    return result.edges.map((edge: Edge) => {
                        return {
                            ...edge,
                            from: mergedNodes.find((node) => node.label === edge.from)?.id,
                            to: mergedNodes.find((node) => node.label === edge.to)?.id,
                        };
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

        if (names.length >   0) {
            fetchConnections();
        } else {
            setConnections({
                title: 'Merged Connections',
                nodes: [],
                edges: [],
            });
            setLoading(false);
            setError('No names provided');
        }
    }, [names, credentials, connections.nodes]);

    return {
        connections,
        loading,
        error,
        loadingPercentage
    };
};

export default useConnections;
