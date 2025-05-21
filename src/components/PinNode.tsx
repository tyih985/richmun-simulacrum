import React, { memo } from 'react';
import { NodeProps, Node } from '@xyflow/react';
import { PinNodeDataType } from '@types';

const PIN_SIZE = 45;
const IMAGE_SIZE = 27;

export const PinNode = memo(
  ({ data, selected, dragging }: NodeProps<Node<PinNodeDataType>>) => {
    const {
      color = '#FF5733', // Default color if none provided
      iconUrl,
      size: sizeProp, // Default size if none provided
    } = data;

    const size = sizeProp || iconUrl ? IMAGE_SIZE : PIN_SIZE;

    return (
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className={selected && !dragging ? 'bouncing-pin' : ''}>
          {/* Pin display - either an icon or a triangle */}
          {iconUrl ? (
            <img
              src={iconUrl}
              alt="Pin Icon"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                objectFit: 'contain',
              }}
            />
          ) : (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${size / 4}px solid transparent`,
                borderRight: `${size / 4}px solid transparent`,
                borderTop: `${size / 2}px solid ${color}`,
                marginTop: `${size / 8}px`,
              }}
            />
          )}
        </div>
      </div>
    );
  },
);
