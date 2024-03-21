"use client";

import React, { useRef, useEffect } from "react";
import { DataSet, Network, Node, Edge, Options } from "vis-network";
import styles from "./EntityConnections.module.scss";
import { useEntityOverlay as useEntityOverlay } from "@/hooks/useEntityOverlay";

interface EntityConnectionsProps {
  connections: { nodes: Node[]; edges: Edge[] };
  options?: Options;
  events?: { [key: string]: Function };
  getNetwork?: Function;
  getNodes?: Function;
  getEdges?: Function;
  identifier?: string;
  style?: React.CSSProperties;
}

const EntityConnections: React.FC<EntityConnectionsProps> = ({ connections: graphData, options, events, getNetwork }) => {
  const container = useRef<HTMLDivElement | null>(null);
  const { edges, nodes } = graphData;
  const { setName } = useEntityOverlay();

  const mergeDuplicateNodes = (nodeArray: Node[]): Node[] => {
    const idMap = new Map<string, Node>(); 
    for (const node of nodeArray as Node[]) {
      if (!idMap.has(node.id as string)) {
        idMap.set(node.id as string, node);
      } else {
        // Merge duplicate node by updating the properties
        const existingNode = idMap.get(node.id as string);
        if (existingNode) {
          idMap.set(node.id as string, { ...existingNode, ...node });
        }
      }
    }
    return Array.from(idMap.values());
  };

  // Inside the useEffect block
  useEffect(() => {
    let network: Network | null = null;

    const defaultOptions: Options = {
      // default zoom 2x
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -2000, // Adjust this to make nodes stay closer or farther away
          centralGravity:  0.3, // Adjust this to make nodes stay closer or farther away
        },
        stabilization: {
          enabled: true,
          iterations:  1000,
          updateInterval:  100,
          onlyDynamicEdges: false,
          fit: true
        }
      },
      autoResize: true,
      edges: {
        smooth: false,
        color: "#ffffff",
        width: 1,
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 1,
          },
        },
      },
      nodes: {
        shape: "dot",
        size: 20,
        opacity: 1,
        font: {
          size: 20,
          color: "#ffffff",
          face: "Inter", // Change the font face
        },
        color: {
          border: "#ffffff",
          background: "#ffffff",
          highlight: {
            background: "#420000",
            border: "#ffffff",
          },
        },
        borderWidth: 2,
        shadow: true,
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    if (container.current) {
      // Destroy the previous network instance if it exists
      if (network) {
        (network as Network)?.destroy();
      }

      // Merge duplicate nodes
      const mergedNodes = mergeDuplicateNodes(nodes);

      // Check for duplicate node IDs before creating the network instance
      const uniqueNodeIds = new Set(mergedNodes.map((node) => node.id));
      if (uniqueNodeIds.size !== mergedNodes.length) {
        console.error("Duplicate node IDs detected. Please ensure each node has a unique ID.");
        return;
      }

      // Create a new network instance
      network = new Network(container.current, { edges, nodes: mergedNodes }, mergedOptions);

      if (events) {
        for (const eventName of Object.keys(events)) {
          network.on(eventName as any, events[eventName] as any);
        }
      }

      // Add onClick event to nodes
      network.on("doubleClick", (properties) => {
        if (properties.nodes.length > 0) {
          const nodeId = properties.nodes[0];
          const node = mergedNodes.find((n) => n.id === nodeId);
          if (node) {
            setName(node.label as string);
          }
        }
      });
    }

    if (getNetwork && network) {
      getNetwork(network);
    }

    // Additional logic for getNodes, getEdges
  }, [edges, nodes, options, events, getNetwork]);

  const identifier = "graph-container";

  // Render the graph

  return (
    <div className={styles.graphContainer}>
      <div className={styles.graph} id={identifier} ref={container} />
      {/* <h5 className={styles.graphTitle}>Connections</h5> */}
    </div>
  );
};

export default EntityConnections;
