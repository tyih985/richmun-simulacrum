import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';

// Empty data type for now
type DraftNodeData = {
  color?: string;
};

export const DraftNode = memo(
  ({
    data,
    positionAbsoluteX: xPos,
    positionAbsoluteY: yPos,
  }: NodeProps<Node<DraftNodeData>>) => {
    return (
      <div
        style={{
          position: 'relative',
          width: '40px',
          height: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Black triangle pointing downward */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '20px solid black',
            marginTop: '5px',
          }}
        />

        {/* Coordinate display */}
        <div style={{ fontSize: '8px', textAlign: 'center' }}>
          ({Math.round(xPos || 0)}, {Math.round(yPos || 0)})
        </div>
      </div>
    );
  },
);
