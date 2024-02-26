import { Edge, Node } from 'vis-network';
import fs from 'fs';
import * as glob from 'glob';
import { FileContent } from '@/types';
import { inexactMetadataMarkdown } from './metadata';
import { getFilePaths, loadFile } from './file';
import exp from 'constants';

export interface Connection {
  title?: string;
  nodes: Node[];
  edges: Edge[];
}

export const getOutgoingFiles = (file: FileContent, credentials: string[]): FileContent[] => {
  let files: FileContent[] = [];

  let content = inexactMetadataMarkdown(file.metadata, file.markdown);
  let matches = content.match(/\[\[(.*?)\]\]/g) || [];

  matches.forEach(matchValue => {
    if (matchValue == null || matchValue.length === 0) return;
    const nodeName = matchValue.replace('[[', '').replace(']]', '');
    const node = loadFile(credentials, nodeName);
    if (node) {
      files.push(node);
    }
  });

  files = files.filter((file, index, self) =>
    index === self.findIndex((t) => (
      t.name === file.name
    ))
  );

  return files;
}

export const getIncomingFiles = (file: FileContent, credentials: string[]): FileContent[] => {
  let files: FileContent[] = [];
  let allFiles = getFilePaths();

  allFiles = allFiles.filter(filePath => {
    return !filePath.includes('concepts');
  });

  allFiles.forEach(filePath => {
    let otherFile = loadFile(credentials, undefined, filePath);
    if (!otherFile) return;
    let outgoingFiles = getOutgoingFiles(otherFile, credentials);
    if (outgoingFiles.find(outgoingFile => outgoingFile.name === file.name)) {
      files.push(otherFile);
    }
  });

  files = files.filter((file, index, self) =>
    index === self.findIndex((t) => (
      t.name === file.name
    ))
  );

  return files;
}

export const buildNodesAndEdges = (
  file: FileContent,
  credentials: string[]
): Connection => {
  let connection: Connection = { edges: [], nodes: [] };
  let nodes = connection.nodes;
  let edges = connection.edges;
  let existingNodes = new Map<string, number>();

  if (file.name === file.name) {
    nodes.push(generateNode(file, 0));
    existingNodes.set(file.name, 0);
  }

  let outgoingFiles = getOutgoingFiles(file, credentials);
  let incomingFiles = getIncomingFiles(file, credentials);

  if (outgoingFiles.length > 0) {
    outgoingFiles.forEach(outgoingFile => {
      const outgoingNodeId = nodes.length + 1;
      if (!existingNodes.has(outgoingFile.name)) {
        nodes.push(generateNode(outgoingFile, outgoingNodeId));
        existingNodes.set(outgoingFile.name, outgoingNodeId);
      }

      edges.push(generateEdge(existingNodes.get(file.name) || 0, existingNodes.get(outgoingFile.name) || 0));
    });
  }

  if (incomingFiles.length > 0) {
    incomingFiles.forEach(incomingFile => {
      const incomingNodeId = nodes.length + 1;
      if (!existingNodes.has(incomingFile.name)) {
        nodes.push(generateNode(incomingFile, incomingNodeId));
        existingNodes.set(incomingFile.name, incomingNodeId);
      }

      edges.push(generateEdge(existingNodes.get(incomingFile.name) || 0, existingNodes.get(file.name) || 0));
    });
  }

  return connection;
};

const getDarkerColor = (color: string, amount: number): string => {
  const hex = color.replace(/^#/, ''); // Ensure the '#' is at the start
  const c_r = hex.match(/.{1,2}/g) || ['00', '00', '00'];

  const [r, g, b] = c_r.map((channel) => Math.max(parseInt(channel, 16) - amount, 0));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const getColorBackground = (category: string, darker: number = 0): string => {
  switch (category) {
    case 'concepts':
      return getDarkerColor('#a840a8', darker);
    case 'creatives':
      return getDarkerColor('#ff2a2a', darker);
    case 'collectives':
      return getDarkerColor('#de5454', darker);
    case 'collaborations':
      return getDarkerColor('#40a8a8', darker);
    default:
      return getDarkerColor('#C4C4C4', darker);
  }
};

const getShape = (category: string): string => {
  switch (category) {
    case 'concepts':
      return 'diamond';
    case 'creatives':
        return 'dot';
    case 'collectives':
      return 'box';
    case 'collaborations':
      return 'box';
    default:
      return 'text';
  }
};

export const generateNode = (file: FileContent, id: number): Node => {
  return {
    id,
    label: file.name,
    title: `Node: ${id}, Name: ${file.name}`,

    color: {
      background: getColorBackground(file.category || '', 42),
      border: id == 0 ? '#ffffff' : '#000000',
      highlight: {
        background: '#420000',
        border: '#ffffff',
      },
      hover: {
        background: getColorBackground(file.category || ''),
      },
    },
    level: Math.round(Math.random() * 10),
    shape: getShape(file.category || ''),
    size: id == 0 ? 20 : 10,
    borderWidth: 3,
    // id== 0 is center
    fixed: id == 0 ? true : false,
  } as Node;

};

export const generateEdge = (from: number, to: number): Edge => {
  return {
    from,
    to,
  };
}

export const findConnections = (
  file: FileContent,
  credentials: string[],
  depth: number = 2
): Connection => {
  let connection: Connection = { edges: [], nodes: [] };
  let nodes = connection.nodes;
  let edges = connection.edges;
  let existingNodes = new Map<string, number>();

  const traverse = (currentFile: FileContent, currentDepth: number) => {
    if (currentDepth <= 0) return;

    let outgoingFiles = getOutgoingFiles(currentFile, credentials);
    let incomingFiles = getIncomingFiles(currentFile, credentials);

    if (outgoingFiles.length > 0) {
      outgoingFiles.forEach(outgoingFile => {
        const outgoingNodeId = nodes.length + 1;
        if (!existingNodes.has(outgoingFile.name)) {
          nodes.push(generateNode(outgoingFile, outgoingNodeId));
          existingNodes.set(outgoingFile.name, outgoingNodeId);
        }

        edges.push(generateEdge(existingNodes.get(currentFile.name) || 0, existingNodes.get(outgoingFile.name) || 0));
        traverse(outgoingFile, currentDepth - 1);
      });
    }

    if (incomingFiles.length > 0) {
      incomingFiles.forEach(incomingFile => {
        const incomingNodeId = nodes.length + 1;
        if (!existingNodes.has(incomingFile.name)) {
          nodes.push(generateNode(incomingFile, incomingNodeId));
          existingNodes.set(incomingFile.name, incomingNodeId);
        }

        edges.push(generateEdge(existingNodes.get(incomingFile.name) || 0, existingNodes.get(currentFile.name) || 0));
        traverse(incomingFile, currentDepth - 1);
      });
    }
  };

  if (file.name === file.name) {
    nodes.push(generateNode(file, 0));
    existingNodes.set(file.name, 0);
  }

  traverse(file, depth);

  return connection;
};
