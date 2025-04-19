import dagre from 'dagre';
import { Node, Edge } from '@xyflow/react';

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: { direction: string },
) => {
  // ✅ Create a new Dagre graph
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // ✅ Set the layout direction
  dagreGraph.setGraph({ rankdir: options.direction });

  // ✅ Add nodes to the Dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.measured?.width ?? 150, // Default width
      height: node.measured?.height ?? 50, // Default height
    });
  });

  // ✅ Add edges to the Dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // ✅ Run the layout algorithm
  dagre.layout(dagreGraph);

  // ✅ Apply the new positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    return {
      ...node,
      data: { ...node.data, direction: options.direction },
      position: {
        x: dagreNode?.x ?? node.position.x,
        y: dagreNode?.y ?? node.position.y,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default getLayoutedElements;
