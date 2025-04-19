import { ReactElement, ReactNode, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { animate } from 'popmotion';
import { Paper, Title, Text, SimpleGrid } from '@mantine/core';

import { FlowEdgeType } from '@lib/informationMap/infoEdges';
import {
  InformationNodeKeysType,
  InformationNodes,
  InformationNodesType,
} from '@lib/informationMap/infoNodes';
import { useReactFlowViewport } from '@hooks/useFlowViewport';
import { getCenter } from '@packages/calculateCoordinates';
import { useSelectedFocus } from '@hooks/useSelectedFocus';

export const TextbookReaderPreview = (): ReactElement => {
  const { mapMtd } = useSelectedFocus();
  const { getNode, setCenter, getViewport } = useReactFlow();
  const { getViewportSize } = useReactFlowViewport();
  const allNodesData: InformationNodesType = {
    root: mapMtd.rootNode,
    ...InformationNodes,
  };
  const onSelectNode = useCallback(
    (nodeKey: string) => {
      if (!getNode || !setCenter) return;
      const targetNode = getNode(nodeKey);
      if (!targetNode?.position) return;

      const currentViewport = getViewport();
      const viewportSize = getViewportSize();
      const currentCenter = getCenter({ viewport: currentViewport, viewportSize });

      animate({
        from: { ...currentCenter, zoom: currentViewport.zoom },
        to: { ...targetNode.position, zoom: 1 },
        onUpdate: ({ x, y, zoom }) => setCenter(x, y, { zoom }),
        duration: 300,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // on click outside, or un-selecting a node, should call fitview

  return (
    <SimpleGrid cols={1}>
      <Title order={1}>{mapMtd.focusLabel}</Title>
      <InformationTile
        nodeKey={'root'}
        nodesReference={allNodesData}
        onClick={onSelectNode}
      />
      {mapMtd.edges.map((edge) => {
        return (
          <InformationTile
            nodeKey={edge.target}
            nodesReference={allNodesData}
            edge={edge}
            onClick={onSelectNode}
          />
        );
      })}
    </SimpleGrid>
  );
};

// the information tile should probably use a context provider in order to be able to access map data
const InformationTile = ({
  nodeKey,
  edge,
  nodesReference,
  detailsPriorityMap,
  onClick,
}: {
  nodeKey: string;
  nodesReference: InformationNodesType;
  edge?: FlowEdgeType;
  detailsPriorityMap?: Record<InformationNodeKeysType, string[]>;
  onClick?: (nodeKey: string) => void;
}): ReactNode => {
  if (!nodesReference[nodeKey]) {
    console.log('debugger', { nodeKey, nodesReference });
    console.error(`wtf. This node doesn't seem to exist: ${nodeKey}`);
    return <Paper />;
  }
  if (edge && !nodesReference[edge.source]) {
    console.log('debugger', { key: edge.source, nodesReference });
    console.error(`wtf. This source node doesn't seem to exist: ${edge.source}`);
  }
  if (edge && !nodesReference[edge.target]) {
    console.log('debugger', { key: edge.target, nodesReference });
    console.error(`wtf. This target node doesn't seem to exist: ${edge.target}`);
  }
  const { description, details } = nodesReference[nodeKey];
  const showAllDetails = detailsPriorityMap && !detailsPriorityMap[nodeKey];
  const detailsToShow =
    !showAllDetails && detailsPriorityMap && detailsPriorityMap[nodeKey]
      ? detailsPriorityMap[nodeKey]
      : Object.keys(details);
  // const detailsToHide = !showAllDetails
  //   ? Object.keys(details).filter((detailKey) => !detailsToShow.includes(detailKey))
  //   : [];

  return (
    <Paper
      key={nodeKey}
      onClick={() => {
        if (onClick) onClick(nodeKey);
      }}
    >
      {edge && (
        <Text>
          {nodesReference[edge.source] ? nodesReference[edge.source].name : ''}{' '}
          {edge.data?.label}{' '}
          {nodesReference[edge.target] ? nodesReference[edge.target].name : ''}
        </Text>
      )}
      {/* <Title order={4}>{.name}</Title> */}
      {description && <Text>{description}</Text>}
      <ul>
        {detailsToShow.map((detailKey) => (
          <li key={detailKey}>
            {/* <Text size="sm" c="supporting">
            [ {detail.type} ] {detail.label}
          </Text> */}
            <Text size="sm">{details[detailKey].body}</Text>
          </li>
        ))}
      </ul>
    </Paper>
  );
};

export default TextbookReaderPreview;
