import React, { memo } from 'react';
import { NodeProps, Node, NodeResizer } from '@xyflow/react';
import { SpoilerNodeDataType } from '@types';
import { useCommitteeAccess } from '@hooks/useCommitteeAccess';

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 150;

export const SpoilerNode = memo(
  ({ data, selected }: NodeProps<Node<SpoilerNodeDataType>>) => {
    const {
      color = '#fff',
      text = 'hidden',
      visibilityFactions = [],  
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
    } = data;

    const { userFactions } = useCommitteeAccess();

    // Check if user has visibility access
    const hasVisibilityAccess = visibilityFactions.length === 0 || 
      visibilityFactions.some(faction => userFactions.includes(faction));

    return (
      <>
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: hasVisibilityAccess ? 'transparent' : color,
            border: hasVisibilityAccess ? `2px dashed ${color}` : `2px solid ${color}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hasVisibilityAccess ? 0.3 : 1,
            position: 'relative',
            pointerEvents: 'all',
          }}
        >
          {/* Show text only when user doesn't have visibility access */}
          {!hasVisibilityAccess && (
            <span
              style={{
                color: getContrastColor(color),
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '8px',
                wordBreak: 'break-word',
              }}
            >
              {text}
            </span>
          )}
          
          {/* Show subtle indicator when user has visibility access */}
          {hasVisibilityAccess && (
            <span
              style={{
                color: color,
                fontSize: '12px',
                opacity: 0.6,
                textAlign: 'center',
                fontStyle: 'italic',
              }}
            >
              Hidden Content
            </span>
          )}
        </div>
      </>
    );
  },
);

// Helper function to determine contrasting text color
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const color = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}