import { ReactElement } from 'react';
import { ReactFlow } from '@xyflow/react';
import { MapBackgroundNode } from '@components/MapBackgroundNode';
import { DraftNode } from '@components/DraftNode';
import { PinNode } from '@components/PinNode';

const ViewPortPadding = 200;

export const MapPage = (): ReactElement => {
  const nodeTypes = {
    background: MapBackgroundNode,
    draft: DraftNode,
    pin: PinNode,
  };

  const nodes = [
    {
      type: 'background',
      id: '1',
      data: {
        mapUrl:
          'https://cdn.discordapp.com/attachments/1367630288792064000/1372650083627045118/IMG_4489.webp?ex=682ecbc2&is=682d7a42&hm=a348de612108e5993058251f3b1b06be595bcceca4877ef1ea3c26eabd2e3ec7',
        height: 1000,
      },
      draggable: false,
      position: {
        x: 0,
        y: 0,
      },
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

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow
        nodes={nodes}
        edges={[]}
        nodeTypes={nodeTypes}
        maxZoom={20}
        translateExtent={[
          [0 - ViewPortPadding, 0 - ViewPortPadding],
          [1000 + ViewPortPadding, 1000 + ViewPortPadding],
        ]}
      />
    </div>
  );
};

export default MapPage;
