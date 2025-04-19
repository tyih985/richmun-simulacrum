import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Node,
  Edge,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import {
  allInformationNodes,
  convertNodeInfoToNode,
  DirectionType,
} from '@lib/informationMap/infoNodes';
import getLayoutedElements from '@packages/autoLayout';
import { ConceptNode } from '@components/ConceptNode';
import { useReactFlowViewport } from '@hooks/useFlowViewport';
import { useSelectedFocus } from '@hooks/useSelectedFocus';

export const MindmapView = (): ReactElement => {
  const { refCallback } = useReactFlowViewport();
  const { fitView, getNode, setCenter } = useReactFlow();
  const { mapMtd } = useSelectedFocus();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const applyInitialLayout = async (
    nodes: Node[],
    edges: Edge[],
    options?: {
      direction?: DirectionType;
      fitViewAfter?: boolean;
    },
  ) => {
    const layouted = await getLayoutedElements(nodes, edges, {
      direction: options?.direction ?? 'LR',
    });
    setNodes(layouted.nodes.map((n) => ({ ...n, type: 'custom' })));
    setEdges(layouted.edges);
    if (options?.fitViewAfter)
      setTimeout(() => {
        fitView({ duration: 300 });
      }, 0);
  };

  const onLayout = useCallback(
    async (direction: DirectionType) => {
      applyInitialLayout(nodes, edges, { direction, fitViewAfter: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, edges],
  );

  useEffect(() => {
    const edges = mapMtd.edges;
    const mentionedNodes = (() => {
      const uniqueNodes = new Set<string>();

      edges.forEach(({ source, target }) => {
        uniqueNodes.add(source);
        uniqueNodes.add(target);
      });
      const uniqueNodeKeys = Array.from(uniqueNodes);

      return allInformationNodes.filter((node) => uniqueNodeKeys.includes(node.id));
    })();
    const initialNodes = [
      convertNodeInfoToNode('root', mapMtd.rootNode),
      ...mentionedNodes,
    ];
    applyInitialLayout(initialNodes, edges, { fitViewAfter: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapMtd]);

  return (
    <div style={{ height: '100vh', width: '100%' }} ref={refCallback}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={{ custom: ConceptNode }} fitView>
        <Background />
        <Controls position="top-right" orientation="vertical" />
        <Panel position="top-right">
          <div style={{ paddingRight: '36px' }}>
            <button onClick={() => onLayout('TB')}>vertical layout</button>
            <button onClick={() => onLayout('LR')}>horizontal layout</button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default MindmapView;
