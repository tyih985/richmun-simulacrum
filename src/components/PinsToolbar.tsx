import React, { useState, memo } from 'react';
import { Panel } from '@xyflow/react';
import { PinNodeDataType } from '@types';

// Define different pin configurations
const PIN_CONFIGURATIONS: Array<{
  id: string;
  name: string;
  data: PinNodeDataType;
}> = [
  { id: 'red-pin', name: 'Red Pin', data: { color: '#FF5733' } },
  { id: 'blue-pin', name: 'Blue Pin', data: { color: '#3366FF' } },
  { id: 'green-pin', name: 'Green Pin', data: { color: '#33CC33' } },
  { id: 'purple-pin', name: 'Purple Pin', data: { color: '#9933FF' } },
  { id: 'orange-pin', name: 'Orange Pin', data: { color: '#FF8C33' } },
  { id: 'pink-pin', name: 'Pink Pin', data: { color: '#FF33B8' } },
  { id: 'yellow-pin', name: 'Yellow Pin', data: { color: '#FFD700' } },
  { id: 'teal-pin', name: 'Teal Pin', data: { color: '#33FFCC' } },
  // Example of pins with icons
  { 
    id: 'star-icon', 
    name: 'Star Icon', 
    data: { 
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      size: 30
    } 
  },
  { 
    id: 'flag-icon', 
    name: 'Flag Icon', 
    data: { 
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448513.png',
      size: 30
    } 
  },
  // Example of custom sized colored pins
  { 
    id: 'large-red', 
    name: 'Large Red Pin', 
    data: { 
      color: '#FF5733',
      size: 60
    } 
  },
];

const PIN_SIZE = 30;

interface ToolbarProps {
  onDragStart: (event: React.DragEvent, pinConfig: PinNodeDataType) => void;
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

export const PinsToolbar = memo(({ onDragStart }: ToolbarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Panel
      position="bottom-center"
      style={{
        transform: `translate(-50%, ${isHovered ? '0' : 'calc(100% - 50px)'})`,
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1000,
        bottom: 0,
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
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginRight: '8px',
              flexShrink: 0,
            }}
          >
            Drag pins to map:
          </span>
          
          {PIN_CONFIGURATIONS.map((pinConfig) => (
            <div
              key={pinConfig.id}
              draggable
              onDragStart={(event) => onDragStart(event, pinConfig.data)}
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
              title={pinConfig.name}
            >
              <PinPreview data={pinConfig.data} />
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
});

PinsToolbar.displayName = 'Toolbar';