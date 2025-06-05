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
import { PinNode } from '@components/PinNode';
import { PinsToolbar } from '@components/PinsToolbar';
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
    (position: XYPosition, nodeType = 'pin', nodeData?: PinNodeDataType) => {
      if (!committeeId || !mapKey) return;

      const newNode: PostablePinNodeType = {
        type: 'pin', // nodeType,
        position,
        ...(nodeData || {}), // Ensure data is always present
      };

      console.log('Creating node with full structure:', newNode); // Debug log
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
        addNode(position, 'draft');
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

  // Handle drag start from toolbar - now accepts full pin configuration
  const handleToolbarDragStart = useCallback(
    (event: React.DragEvent, pinData: PinNodeDataType) => {
      event.dataTransfer.setData('application/reactflow', 'pin');
      // Serialize the entire pin configuration as JSON
      event.dataTransfer.setData('pin/config', JSON.stringify(pinData));
      event.dataTransfer.effectAllowed = 'move';
      console.log('Drag started with pin config:', pinData); // Debug log
    },
    [],
  );

  // Handle drop on pane
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const pinConfigJson = event.dataTransfer.getData('pin/config');

      console.log('Drop event - type:', type, 'config JSON:', pinConfigJson); // Debug log

      // Check if the dropped element is a pin from our toolbar
      if (typeof type === 'undefined' || !type || type !== 'pin') {
        console.log('Not a pin drop, ignoring');
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      if (pinConfigJson) {
        try {
          const pinConfig = JSON.parse(pinConfigJson) as PinNodeDataType;
          console.log('Parsed pin config:', pinConfig);
          console.log(
            'Adding pin node at position:',
            position,
            'with config:',
            pinConfig,
          );
          addNode(position, 'pin', pinConfig);
        } catch (error) {
          console.error('Failed to parse pin configuration:', error);
          console.error('Raw config JSON:', pinConfigJson);
        }
      } else {
        console.log('No pin config found in dataTransfer');
      }
    },
    [screenToFlowPosition, addNode],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

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
        onDrop={onDrop}
        onDragOver={onDragOver}
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

      {/* Toolbar for dragging pins */}
      {accessLevel === 'staff' && <PinsToolbar onDragStart={handleToolbarDragStart} />}

      {selectedMapPins.length > 0 && (
        <Panel position="bottom-center" style={{ marginBottom: '100px' }}>
          <NodeEditor onPublish={(data) => console.log(data)} />
        </Panel>
      )}
    </div>
  );
};

export default MapView;

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
