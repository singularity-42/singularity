import React from 'react';
import { ForceGraph2D } from 'react-force-graph';
import styles from './Graph.module.scss';

interface GraphProps {
 graphData: { nodes: any[], links: any[] };
}

const Graph: React.FC<GraphProps> = ({ graphData }) => {
 return (
 <div className={styles.graphContainer}>
   <ForceGraph2D
     graphData={graphData}
     nodeCanvasObject={(node, ctx, globalScale) => {
       const label = node.id;
       const fontSize = 12 / globalScale;
       ctx.font = `${fontSize}px sans-serif`;
       ctx.textAlign = 'center';
       ctx.textBaseline = 'middle';
       ctx.fillStyle = styles.nodeLabel;
       ctx.fillText(label, node.x, node.y);
     }}
     linkColor={styles.link}
     nodeColor={styles.node}
   />
 </div>
 );
}

export default Graph;
