import { Edge, Node } from 'vis-network';
import fs from 'fs';
import * as glob from 'glob';
import { FileContent } from '@/types';
import { inexactMetadataMarkdown } from './metadata';
import { loadFile } from './file';

export interface Connection {
  title?: string;
  nodes: Node[];
  edges: Edge[];
}

export const extractNodesAndEdges = (
  content: string,
  sourceNodeId: number,
  existingNodes: Map<string, number>,
  nodes: Node[],
  edges: Edge[],
  depth: number
): Connection => {
  const matches = content.match(/\[\[(.*?)\]\]/g);

  if (matches) {
    matches.forEach(match => {
      const nodeName = match.replace('[[', '').replace(']]', '');
      const nodeId = nodes.length + 1;

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

        existingNodes.set(nodeName, nodeId);
      }

      edges.push({
        from: sourceNodeId,
        to: existingNodes.get(nodeName) || 0,
      });

      if (depth > 0) {
        const file = loadFile(nodeName);
        if (file) {
          let content = inexactMetadataMarkdown(file.metadata, file.markdown);
          const result = extractNodesAndEdges(content, nodeId, existingNodes, nodes, edges, depth - 1);
          nodes = result.nodes;
          edges = result.edges;
        }
      }
    });
  }

  return { nodes, edges } as Connection;
};

export const buildNodesAndEdges = (
  file: FileContent,
  existingNodes: Map<string, number>,
  nodes: Node[],
  edges: Edge[],
  depth: number
): Connection => {
  const mainNodeId = nodes.length + 1;
  let content = inexactMetadataMarkdown(file.metadata, file.markdown);
  const result: Connection = { nodes, edges };

  if (!existingNodes.has(file.name)) {
    if (file.name === file.name) {
      nodes.push({
        id: 0,
        label: file.name,
        title: `Node: 1, Name: ${file.name}`,
        color: {
          background: '#ff4242',
          border: '#ff4242',
          highlight: {
            background: '#420000',
            border: '#ffffff',
          },
        },
        borderWidth: 3,
      });

      const extractResult = extractNodesAndEdges(content, mainNodeId, existingNodes, nodes, edges, depth);
      result.nodes = extractResult.nodes;
      result.edges = extractResult.edges;
    } else if (file.name && content.includes(file.name)) {
      nodes.push({
        id: mainNodeId,
        label: file.name,
        title: `Node: ${mainNodeId}, Name: ${file.name}`,
      });

      edges.push({
        from: 0,
        to: mainNodeId,
      });

      existingNodes.set(file.name, mainNodeId);
    }
  }

  return result;
};

export const addMissingEdges = (nodes: Node[], edges: Edge[]): Connection => {
  for (const node of nodes) {
    if (node.id !== 0) {
      edges.push({
        from: 0,
        to: node.id,
      });
    }
  }

  return { nodes, edges } as Connection;
};
