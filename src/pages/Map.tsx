import { ReactElement } from 'react';
import { ReactFlow } from '@xyflow/react';
import { MapBackgroundNode } from '@components/MapBackgroundNode';

const ViewPortPadding = 200;

export const MapPage = (): ReactElement => {
  const nodeTypes = {
    mapBackgroundNode: MapBackgroundNode,
  };

  const nodes = [
    {
      type: 'mapBackgroundNode',
      id: '1',
      data: {
        mapUrl:
          'https://media.istockphoto.com/id/1308342070/vector/city-map-navigation-location-map-with-city-street-roads-gps-navigator-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZddvO4teNrq8_MsG2vszU_V44ykmJqc9anrJvgXpGSM=',
        height: 1000,
        width: 1000,
      },
      draggable: false,
      position: {
        x: 0,
        y: 0,
      },
    },
  ];

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow
        nodes={nodes}
        edges={[]}
        nodeTypes={nodeTypes}
        translateExtent={[
          [0 - ViewPortPadding, 0 - ViewPortPadding],
          [1000 + ViewPortPadding, 1000 + ViewPortPadding],
        ]}
      />
    </div>
  );
};

export default MapPage;
