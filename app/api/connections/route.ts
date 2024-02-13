import { Connection, buildNodesAndEdges, addMissingEdges } from '@/utilities/connections';
import { NextRequest, NextResponse } from 'next/server';
import { loadFiles } from '@/utilities/file';

export const GET = async (req: NextRequest, res: NextResponse): Promise<Response> => {
  let relation: Connection = {
    nodes: [],
    edges: [],
  };

  const fileName = req.nextUrl.searchParams.get('name');
  const depth = req.nextUrl.searchParams.get('depth') || 3;
  const fileFiles = loadFiles();
  const existingNodes = new Map<string, number>(); // To track existing node labels and their IDs
  const nodes = relation.nodes;
  const edges = relation.edges;

  for (const file of fileFiles) {
    const { nodes: newNodes, edges: newEdges } = buildNodesAndEdges(file, existingNodes, nodes, edges, depth as number);
    nodes.push(...newNodes);
    edges.push(...newEdges);
  }

  addMissingEdges(nodes, edges);

  relation = {
    title: fileName || '',
    nodes,
    edges,
  };

  return new Response(JSON.stringify(relation), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
};
