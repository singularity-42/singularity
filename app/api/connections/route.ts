import { Connection, buildNodesAndEdges, findConnections } from '@/data/tools/connections';
import { NextRequest, NextResponse } from 'next/server';
import { loadFile } from '@/data/tools/file';

export const GET = async (req: NextRequest, res: NextResponse): Promise<Response> => {
  let relation: Connection = {
    nodes: [],
    edges: [],
  };
  const fileName = req.nextUrl.searchParams.get('name');
  const fileData = req.nextUrl.searchParams.get('data');
  if (!fileName){ 
    return new Response(JSON.stringify(relation), { status: 400 })};

  let credentials = (req.headers.get("Authorization")?.split(' ')[1] || '').split(':') || [];
  
  const file = loadFile(credentials, fileName);
  if (!file) {
    return new Response(JSON.stringify(relation), { status: 404 });
  }
  const connection = findConnections(file, credentials);

  relation = {
    title: file.name,
    nodes: connection.nodes,
    edges: connection.edges,
  };

  return new Response(JSON.stringify(relation), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
};
