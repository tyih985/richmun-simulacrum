import React, { useState, memo } from 'react';
import { Panel } from '@xyflow/react';
import { PinNodeDataType, SpoilerNodeDataType } from '@types';
import { Text} from '@mantine/core'

// Define different pin configurations
const PIN_CONFIGURATIONS: Array<{
  id: string;
  name: string;
  type: 'pin';
  data: PinNodeDataType;
}> = [
 { 
    id: 'star-icon', 
    name: 'Star Icon', 
    type: 'pin',
    data: { 
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      size: 30
    } 
  },
  { 
    id: 'flag-icon', 
    name: 'Flag Icon', 
    type: 'pin',
    data: { 
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448513.png',
      size: 30
    } 
  },
  // Example of custom sized colored pins
  { 
    id: 'large-red', 
    name: 'Large Red Pin', 
    type: 'pin',
    data: { 
      color: '#000000',
      size: 60
    } 
  },
];

// Define different spoiler configurations
const SPOILER_CONFIGURATIONS: Array<{
  id: string;
  name: string;
  type: 'spoiler';
  data: SpoilerNodeDataType;
}> = [
  {
    id: 'basic-spoiler',
    name: 'Basic Spoiler',
    type: 'spoiler',
    data: {
      color: '#000000',
      text: 'SPOILER',
      width: 200,
      height: 150,
    }
  },
  {
    id: 'red-spoiler',
    name: 'Red Spoiler',
    type: 'spoiler',
    data: {
      color: '#FF0000',
      text: 'CLASSIFIED',
      width: 250,
      height: 100,
    }
  },
  {
    id: 'large-spoiler',
    name: 'Large Spoiler',
    type: 'spoiler',
    data: {
      color: '#333333',
      text: 'HIDDEN',
      width: 300,
      height: 200,
    }
  },
];

const PIN_SIZE = 30;

type NodeConfiguration = typeof PIN_CONFIGURATIONS[0] | typeof SPOILER_CONFIGURATIONS[0];

interface ToolbarProps {
  onDragStart: (event: React.DragEvent, nodeType: 'pin' | 'spoiler', nodeData: PinNodeDataType | SpoilerNodeDataType) => void;
}

// Component to render a pin preview based on its configuration
const PinPreview: React.FC<{ data: PinNodeDataType; previewSize?: number }> = ({ 
  data, 
  previewSize = PIN_SIZE 
}) => {
  const { color = '#FF5733', iconUrl, size } = data;
  const displaySize = previewSize;

  return (
    <div
      style={{
        position: 'relative',
        width: `${displaySize}px`,
        height: `${displaySize}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt="Pin Icon"
          style={{
            width: `${displaySize}px`,
            height: `${displaySize}px`,
            objectFit: 'contain',
          }}
        />
      ) : (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${displaySize / 4}px solid transparent`,
            borderRight: `${displaySize / 4}px solid transparent`,
            borderTop: `${displaySize / 2}px solid ${color}`,
          }}
        />
      )}
    </div>
  );
};

// Component to render a spoiler preview
const SpoilerPreview: React.FC<{ data: SpoilerNodeDataType }> = ({ data }) => {
  const { color = '#000000', text = 'SPOILER' } = data;
  
  return (
    <div
      style={{
        width: '40px',
        height: '30px',
        backgroundColor: color,
        border: `1px solid ${color}`,
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '8px',
        color: color === '#000000' ? '#FFFFFF' : '#000000',
        fontWeight: 'bold',
      }}
    >
      {text.substring(0, 4)}
    </div>
  );
};

// Generic preview component that handles both pin and spoiler types
const NodePreview: React.FC<{ config: NodeConfiguration }> = ({ config }) => {
  if (config.type === 'pin') {
    return <PinPreview data={config.data} />;
  } else {
    return <SpoilerPreview data={config.data} />;
  }
};

export const NodesToolbar = memo(({ onDragStart }: ToolbarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Combine all node configurations
  const allConfigurations: NodeConfiguration[] = [
    ...PIN_CONFIGURATIONS,
    ...SPOILER_CONFIGURATIONS,
  ];

  return (
    <Panel
      position="bottom-center"
      style={{
        transform: `translate(-50%, ${isHovered ? '0' : 'calc(100% - 60px)'})`,
        transition: 'transform 0.1s ease-in-out',
        zIndex: 1000,
        bottom: 0,
        margin: 0,
      }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
          padding: '16px 24px 8px 24px',
          border: '1px solid #e5e7eb',
          borderBottom: 'none',
          minHeight: '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '90vw',
        }}
      >
        {/* Handle indicator */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: '#d1d5db',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
        />
        
        {/* Toolbar content */}
        <Text size="sm" color="dimmed">
          Drag pins and spoilers onto map:
        </Text>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {allConfigurations.map((nodeConfig) => (
            <div
              key={nodeConfig.id}
              draggable
              onDragStart={(event) => onDragStart(event, nodeConfig.type, nodeConfig.data)}
              style={{
                cursor: 'grab',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.cursor = 'grabbing';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.cursor = 'grab';
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title={nodeConfig.name}
            >
              <NodePreview config={nodeConfig} />
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
});

NodesToolbar.displayName = 'Toolbar';