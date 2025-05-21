import { ReactElement } from 'react';
import { ReactFlow } from '@xyflow/react';

export const MapPage = (): ReactElement => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow nodes={[{
        id: '1',
        data: {},
        position: {
            x: 0, y: 0
        }
      }]} edges={[]} />
    </div>
  );
};

export default MapPage;
