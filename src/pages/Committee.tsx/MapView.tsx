import { ReactElement, useCallback, useEffect, useRef } from 'react';
import {
  NodeOrigin,
  Panel,
  ReactFlow,
  useReactFlow,
  XYPosition,
  Node,
  type OnNodeDrag,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';
import { useParams, useSearchParams } from 'react-router-dom';

import { MapBackgroundNode } from '@components/MapBackgroundNode';
import { DraftNode } from '@components/DraftNode';
import { PinNode } from '@components/PinNode';
import { useFlowState } from '@store/useReactFlow';
import { useSelectedMapPins } from '@hooks/useSelectedMapPins';
import { NodeEditor } from '@components/NodeEditor';
import { useMapNodes } from '@hooks/useMapNodes';
import { mapNodesMutations } from '@mutations/mapNodeMutation';
import { PinNodeDataType, PostablePinNodeType } from '@types';
import { useCommitteeAccess } from '@hooks/useCommitteeAccess';

const ViewPortPadding = 200;
const DOUBLE_CLICK_THRESHOLD = 300;

const nodeOrigin: NodeOrigin = [0.5, 1];

export const MapView = (): ReactElement => {
  const { committeeId: urlCommitteeId } = useParams();
  const [searchParams] = useSearchParams();
  const { availableCommittees, availableMaps, accessLevel } = useCommitteeAccess();

  // Use props if provided, otherwise fall back to URL parameters
  const committeeId = urlCommitteeId;
  const mapKey = searchParams.get('map_key');

  const nodeTypes = {
    background: MapBackgroundNode,
    draft: DraftNode,
    pin: PinNode,
  };

  const { createNode, updateNodePosition } = mapNodesMutations({
    enable: accessLevel === 'staff',
  });
  const selectedMapPins = useSelectedMapPins();
  const { screenToFlowPosition } = useReactFlow();
  const lastClickTimeRef = useRef<number>(0);

  const { nodes: incomingNodes, isLoading } = useMapNodes(
    committeeId || '',
    mapKey || '',
  );

  const { nodes, edges, syncNodes, syncEdges, onNodesChange, onEdgesChange } =
    useFlowState(
      useShallow((state) => ({
        nodes: state.nodes,
        edges: state.edges,
        syncNodes: state.syncNodes,
        syncEdges: state.syncEdges,
        onNodesChange: accessLevel === 'staff' ? state.onNodesChange : undefined,
        onEdgesChange: accessLevel === 'staff' ? state.onEdgesChange : undefined,
      })),
    );

  useEffect(() => {
    syncNodes(incomingNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingNodes]);

  const addNode = useCallback(
    (position: XYPosition) => {
      if (!committeeId || !mapKey) return;

      const newNode: PostablePinNodeType = {
        type: 'draft',
        position,
      };
      createNode(committeeId, mapKey, newNode);
    },
    [createNode, committeeId, mapKey],
  );

  const paneClick = useCallback(
    (event: React.MouseEvent) => {
      if (!committeeId || !mapKey) return;

      const currentTime = new Date().getTime();
      const clickCoordinates = {
        x: event.clientX,
        y: event.clientY,
      };

      const position = screenToFlowPosition({
        x: clickCoordinates.x,
        y: clickCoordinates.y,
      });
      console.log('pane', position);

      const timeSinceLastClick = currentTime - lastClickTimeRef.current;
      lastClickTimeRef.current = currentTime;
      if (timeSinceLastClick < DOUBLE_CLICK_THRESHOLD) {
        addNode(position);
      }
    },
    [addNode, screenToFlowPosition, committeeId, mapKey],
  );

  const onNodeDragStop = useCallback<OnNodeDrag<Node>>(
    (_, node) => {
      if (!committeeId || !mapKey) return;

      console.log('onNodeDragStop');
      updateNodePosition(committeeId, mapKey, node.id, node.position);
    },
    [updateNodePosition, committeeId, mapKey],
  );

  // Don't render if we don't have the required parameters
  if (!committeeId || !mapKey) {
    return <div>Loading...</div>;
  }

  // Validate that the user has access to this committee and map
  if (!availableCommittees.includes(committeeId) || !availableMaps.includes(mapKey)) {
    return <div>Access denied or invalid parameters</div>;
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow
        nodeOrigin={nodeOrigin}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={paneClick}
        maxZoom={20}
        zoomOnDoubleClick={false}
        onNodeDragStop={onNodeDragStop}
        fitView
        snapToGrid
        snapGrid={[0.1, 0.1]}
        draggable={true}
        // translateExtent={[
        //   [0 - ViewPortPadding, 0 - ViewPortPadding],
        //   [1000 + ViewPortPadding, 1000 + ViewPortPadding],
        // ]}
      />
      <Background color="#c4c4c4" gap={50} variant={BackgroundVariant.Cross} />
      {selectedMapPins.length > 0 && (
        <Panel position="bottom-center">
          <NodeEditor onPublish={(data) => console.log(data)} />
        </Panel>
      )}
    </div>
  );
};

export default MapView;

const NODES = [
  {
    type: 'background',
    id: '1',
    data: {
      mapUrl:
        'https://cdn.discordapp.com/attachments/1367630288792064000/1372650083627045118/IMG_4489.webp?ex=682ecbc2&is=682d7a42&hm=a348de612108e5993058251f3b1b06be595bcceca4877ef1ea3c26eabd2e3ec7',
      height: 1000,
    },
    position: {
      x: 0,
      y: 0,
    },
    // these props should be enforced on the type
    draggable: false,
    selectable: false,
  },
  {
    type: 'draft',
    id: '2',
    data: {},
    position: {
      x: 500,
      y: 500,
    },
  },
  // Sample Pin Node with color
  {
    type: 'pin',
    id: '3',
    data: {
      color: '#FF5733',
    },
    position: {
      x: 300,
      y: 300,
    },
  },
  // Sample Pin Node with different color and size
  {
    type: 'pin',
    id: '4',
    data: {
      color: '#3366FF',
    },
    position: {
      x: 400,
      y: 400,
    },
  },
  // Sample Pin Node with icon
  {
    type: 'pin',
    id: '5',
    data: {
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    },
    position: {
      x: 600,
      y: 300,
    },
  },
  // Sample Pin Node with different icon
  {
    type: 'pin',
    id: '6',
    data: {
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448513.png',
    },
    position: {
      x: 700,
      y: 400,
    },
  },
  // Sample Pin Node with just color (no label)
  {
    type: 'pin',
    id: '7',
    data: {
      color: '#33CC33',
    },
    position: {
      x: 350,
      y: 600,
    },
  },
];

export function getClientCoordinates(
  e: Event | MouseEvent | React.MouseEvent<Element> | TouchEvent | PointerEvent,
): { x: number; y: number } {
  if ('clientX' in e && 'clientY' in e) {
    // MouseEvent, PointerEvent, or React.MouseEvent
    return { x: e.clientX, y: e.clientY };
  } else if ('touches' in e && e.touches.length > 0) {
    // TouchEvent with active touches
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else if ('changedTouches' in e && e.changedTouches.length > 0) {
    // TouchEvent with changed touches (like touchend)
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }

  throw new Error('Attempted to get cooridinates on an invalid or incomplete event type');
}
