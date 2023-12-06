import { Relation } from '@/types';
import { Edge, Node } from 'vis-network';
import fs from 'fs';
import * as glob from 'glob';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, res: NextResponse): Promise<Response> => {
 const entityName = req.nextUrl.searchParams.get('name');
 const depth = req.nextUrl.searchParams.get('depth') || 3;
 const entityFiles = glob.sync(`./docs/**/*.md`);
 const existingNodes = new Map<string, number>(); // To track existing node labels and their IDs
 const nodes: Node[] = [];
 const edges: Edge[] = [];

 const extractNodesAndEdges = (content: string, sourceNodeId: number, depth: number): void => {
   const matches = content.match(/\[\[(.*?)\]\]/g);

   if (matches) {
     matches.forEach(match => {
       const nodeName = match.replace('[[', '').replace(']]', '');
       const nodeId = nodes.length + 1;

       // Check if the node label already exists, if not, add it to the nodes
       if (!existingNodes.has(nodeName)) {

         nodes.push({
           id: nodeId,
           label: nodeName,
           title: `Node: ${nodeId}, Name: ${nodeName}`,
         });
         
         edges.push({
           from: sourceNodeId,
           to: nodeId,
         });

         existingNodes.set(nodeName, nodeId); // Store the node label and its ID#

       }

       // Create an edge between source node and the matched node
       edges.push({
         from: sourceNodeId,
         to: existingNodes.get(nodeName) || 0, // Get the ID of the matched node label
       });

       if (depth > 0) {
         const file = glob.sync(`./docs/**/${nodeName}.md`)[0];
         if (file) {
           const fileContent = fs.readFileSync(file, 'utf8');
           extractNodesAndEdges(fileContent, nodeId, depth - 1);
         }
       }
     });
   }
 };

 for (const file of entityFiles) {
   const content = fs.readFileSync(file, 'utf8');
   const fileName = file.split(/\\|\//).slice(-1)[0].split('.md')[0];
   const mainNodeId = nodes.length + 1;

   if (!existingNodes.has(fileName)) {
     if (entityName === fileName) {
       nodes.push({
         id: 0,
         label: fileName,
         title: `Node: 1, Name: ${fileName}`,
         color: {
           background: '#ff4242',
           border: '#ff4242',
           highlight: {
             background: '#420000',
             border: '#ffffff',
           },
         },
         borderWidth: 3, // Increase border width for better visibility
       });

       extractNodesAndEdges(content, mainNodeId, depth as number);

     } else if (entityName && content.includes(entityName)) {
       nodes.push({
         id: mainNodeId,
         label: fileName,
         title: `Node: ${mainNodeId}, Name: ${fileName}`,
       });

       edges.push({
         from: 0,
         to: mainNodeId,
       });

       
       existingNodes.set(fileName, mainNodeId); // Store the main node label and its ID
     }
   }
 }

 const relation: Relation = {
   title: entityName || '',
   nodes: nodes,
   edges: edges,
 };

 return new Response(JSON.stringify(relation), {
   headers: {
     'content-type': 'application/json;charset=UTF-8',
   },
 });
};
