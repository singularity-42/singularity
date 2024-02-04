import React, { useRef, useEffect } from "react";
import { DataSet, Network, Node, Edge, Options } from "vis-network";
import { v4 as uuidv4 } from "uuid";
import styles from "./Graph.module.scss";
import { useDetails } from "@/hooks/provider/DetailsProvider";

interface GraphProps {
  graphData: { nodes: Node[]; edges: Edge[] };
  options?: Options;
  events?: { [key: string]: Function };
  getNetwork?: Function;
  getNodes?: Function;
  getEdges?: Function;
  identifier?: string;
  style?: React.CSSProperties;
}

const Graph: React.FC<GraphProps> = ({ graphData, options, events, getNetwork }) => {
  const container = useRef<HTMLDivElement | null>(null);
  const { edges, nodes } = graphData;
  const { setName } = useDetails();

  useEffect(() => {
    let network: Network | null = null;

    const defaultOptions: Options = {
      // default zoom 2x
      physics: {
        stabilization: false,
      },
      autoResize: false,
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
          face: "Arial", // Change the font face
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
      network = new Network(container.current, { edges, nodes }, mergedOptions);

      if (events) {
        for (const eventName of Object.keys(events)) {
          network.on(eventName as any, events[eventName] as any);
        }
      }

      // Add onClick event to nodes
      network.on("doubleClick", (properties) => {
        if (properties.nodes && properties.nodes.length > 0) {
          const clickedNodeId = properties.nodes[0];
          const clickedNode = nodes.find((node) => node.id === clickedNodeId);

          // Check if a node is clicked and trigger the onClick event
          if (clickedNode) {
            // Perform actions or trigger the onClick event with the clicked node data
            // Call the event handler provided in props, if available
            if (clickedNode.label) setName(clickedNode.label);
            if (events && events.onClick) {
              events.onClick(clickedNode);
            }
          }
        }
      });
    }

    if (getNetwork && network) {
      getNetwork(network);
    }

    // Additional logic for getNodes, getEdges
  }, [edges, nodes, options, events, getNetwork]);

  const identifier = uuidv4(); // Generate a unique identifier

  return (
    <div className={styles.graphContainer}>
      <div className={styles.graph} id={identifier} ref={container}/>
      <h5 className={styles.graphTitle}>Connections</h5>
    </div>
  );
};

export default Graph;
