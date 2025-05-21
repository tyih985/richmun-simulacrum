import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { PinNodeDataType } from '@types';

export const DraftNode = memo(
  ({
    data,
    positionAbsoluteX: xPos,
    positionAbsoluteY: yPos,
    selected,
    dragging,
  }: NodeProps<Node<PinNodeDataType>>) => {
    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className={selected && !dragging ? 'bouncing-pin' : ''}>
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
        </div>
      </div>
    );
  },
);
