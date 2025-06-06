import { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';
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
import { SpoilerNode } from '@components/SpoilerNode';
import { NodesToolbar } from '@components/NodesToolbar';
import { useFlowState } from '@store/useReactFlow';
import { useSelectedMapPins } from '@hooks/useSelectedMapPins';
import { useMapNodes } from '@hooks/useMapNodes';
import { mapNodesMutations } from '@mutations/mapNodeMutation';
import { PinNodeDataType, SpoilerNodeDataType, PostableNodeType } from '@types';
import { useCommitteeAccess } from '@hooks/useCommitteeAccess';
import { SelectedNodeInfo } from '@components/SelectedNodeInfo';
import { BACKGROUND_NODES } from '@lib/mapPrototypeKeys';

const ViewPortPadding = 200;
const DOUBLE_CLICK_THRESHOLD = 300;

const nodeOrigin: NodeOrigin = [0.5, 1];

export const MapView = (): ReactElement => {
  const { committeeId: urlCommitteeId } = useParams();
  const [searchParams] = useSearchParams();
  const { availableCommittees, availableMaps, accessLevel, userFactions } =
    useCommitteeAccess();

  // Use props if provided, otherwise fall back to URL parameters
  const committeeId = urlCommitteeId;
  const mapKey = searchParams.get('map_key');

  const nodeTypes = {
    background: MapBackgroundNode,
    pin: PinNode,
    spoiler: SpoilerNode,
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

  const {
    nodes,
    edges,
    syncNodes,
    syncEdges,
    onNodesChange,
    onEdgesChange,
    setUserFactions,
  } = useFlowState(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      syncNodes: state.syncNodes,
      syncEdges: state.syncEdges,
      onNodesChange: accessLevel === 'staff' ? state.onNodesChange : undefined,
      onEdgesChange: accessLevel === 'staff' ? state.onEdgesChange : undefined,
      setUserFactions: state.setUserFactions,
    })),
  );

  // Set user factions when they change
  useEffect(() => {
    if (userFactions) {
      console.log('Setting user factions:', userFactions);
      setUserFactions(userFactions);
    }
  }, [userFactions, setUserFactions]);

  const backgroundNodes = useMemo(() => {
    return mapKey && BACKGROUND_NODES[mapKey] ? [BACKGROUND_NODES[mapKey]] : [];
  }, [mapKey]);

  useEffect(() => {
    console.log('syncing nodes', {
      incomingNodes,
      background: backgroundNodes
    });

    syncNodes(
      incomingNodes.concat(
       backgroundNodes
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingNodes]);

  const addNode = useCallback(
    (
      position: XYPosition,
      nodeType: 'pin' | 'spoiler' = 'pin',
      nodeData?: PinNodeDataType | SpoilerNodeDataType,
    ) => {
      if (!committeeId || !mapKey) return;

      const newNode: PostableNodeType = {
        type: nodeType,
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
        addNode(position, 'pin');
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

  // Handle drag start from toolbar - now accepts node type and configuration
  const handleToolbarDragStart = useCallback(
    (
      event: React.DragEvent,
      nodeType: 'pin' | 'spoiler',
      nodeData: PinNodeDataType | SpoilerNodeDataType,
    ) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      // Serialize the entire node configuration as JSON
      event.dataTransfer.setData('node/config', JSON.stringify(nodeData));
      event.dataTransfer.effectAllowed = 'move';
      console.log('Drag started with node type:', nodeType, 'config:', nodeData); // Debug log
    },
    [],
  );

  // Handle drop on pane
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData('application/reactflow') as
        | 'pin'
        | 'spoiler';
      const nodeConfigJson = event.dataTransfer.getData('node/config');

      console.log('Drop event - type:', nodeType, 'config JSON:', nodeConfigJson); // Debug log

      // Check if the dropped element is a valid node type from our toolbar
      if (
        typeof nodeType === 'undefined' ||
        !nodeType ||
        (nodeType !== 'pin' && nodeType !== 'spoiler')
      ) {
        console.log('Not a valid node drop, ignoring');
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      if (nodeConfigJson) {
        try {
          const nodeConfig = JSON.parse(nodeConfigJson) as
            | PinNodeDataType
            | SpoilerNodeDataType;
          console.log('Parsed node config:', nodeConfig);
          console.log(
            'Adding node at position:',
            position,
            'with type:',
            nodeType,
            'and config:',
            nodeConfig,
          );
          addNode(position, nodeType, nodeConfig);
        } catch (error) {
          console.error('Failed to parse node configuration:', error);
          console.error('Raw config JSON:', nodeConfigJson);
        }
      } else {
        console.log('No node config found in dataTransfer');
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
      <SelectedNodeInfo />
      {/* Toolbar for dragging pins and spoilers */}
      {accessLevel === 'staff' && <NodesToolbar onDragStart={handleToolbarDragStart} />}
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
