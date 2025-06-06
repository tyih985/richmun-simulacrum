import React, { memo, useState, useEffect, useCallback } from 'react';
import { NodeProps, Node, NodeResizer } from '@xyflow/react';
import { useDebouncedCallback } from '@mantine/hooks';
import { PostableNodeType, SpoilerNodeDataType } from '@types';
import { useCommitteeAccess } from '@hooks/useCommitteeAccess';
import { mapNodesMutations } from '@mutations/mapNodeMutation';
import { useParams } from 'react-router-dom';

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 150;
const MIN_WIDTH = 100;
const MIN_HEIGHT = 50;
const DEBOUNCE_DELAY = 500; // 500ms delay

export const SpoilerNode = memo(
  ({ data, selected, id }: NodeProps<Node<SpoilerNodeDataType>>) => {
    const {
      color = '#fff',
      text = 'hidden',
      visibilityFactions = [],
      width: initialWidth = DEFAULT_WIDTH,
      height: initialHeight = DEFAULT_HEIGHT,
    } = data;

    const { userFactions } = useCommitteeAccess();

    const { committeeId = '' } = useParams();

    // Local state for tracking current dimensions
    const [currentWidth, setCurrentWidth] = useState(initialWidth);
    const [currentHeight, setCurrentHeight] = useState(initialHeight);
    const [isResizing, setIsResizing] = useState(false);

    // Initialize mutations
    const { updateNode } = mapNodesMutations();

    // Update local state when data changes from external source
    useEffect(() => {
      setCurrentWidth(initialWidth);
      setCurrentHeight(initialHeight);
    }, [initialWidth, initialHeight]);

    // Debounced function to update backend using Mantine's hook
    const debouncedUpdateNode = useDebouncedCallback(
      async (newWidth: number, newHeight: number, position: { x: number; y: number }) => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const mapId = urlParams.get('map_key') ?? '';
          const updateData: PostableNodeType = {
            id,
            type: 'spoiler',
            ...data,
            width: newWidth,
            height: newHeight,
            position: position,
          };

          console.log('check ids...', { committeeId, mapId, id });

          await updateNode(committeeId, mapId, id, updateData);
        } catch (error) {
          console.error('Failed to update node size:', error);
        }
      },
      DEBOUNCE_DELAY,
    );

    // Handle resize events
    const handleResize = useCallback(
      (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        event: any,
        params: { width: number; height: number; x: number; y: number },
      ) => {
        const { width, height, x, y } = params;

        // Update local state immediately for responsive UI
        setCurrentWidth(width);
        setCurrentHeight(height);

        // Debounce backend update
        debouncedUpdateNode(width, height, { x, y });
      },
      [debouncedUpdateNode],
    );

    // Handle resize start
    const handleResizeStart = useCallback(() => {
      setIsResizing(true);
    }, []);

    // Handle resize end
    const handleResizeEnd = useCallback(() => {
      setIsResizing(false);
    }, []);

    // Flush pending updates when node becomes unselected
    useEffect(() => {
      if (!selected) {
        debouncedUpdateNode.flush();
      }
    }, [selected, debouncedUpdateNode]);

    // Check if user has visibility access
    const hasVisibilityAccess =
      visibilityFactions.length === 0 ||
      visibilityFactions.some((faction) => userFactions.includes(faction));

    console.log('spoiler node', { hasVisibilityAccess });

    // Render the node
    return (
      <>
        <div
          style={{
            width: `${currentWidth}px`,
            height: `${currentHeight}px`,
            backgroundColor: hasVisibilityAccess ? 'transparent' : color,
            border: hasVisibilityAccess ? `2px dashed ${color}` : `2px solid ${color}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hasVisibilityAccess ? 0.3 : isResizing ? 0.8 : 1,
            position: 'relative',
            pointerEvents: 'all',
            transition: isResizing ? 'none' : 'opacity 0.2s ease',
            boxShadow: isResizing ? `0 0 0 2px ${color}40` : 'none',
          }}
        >
          {/* Show text only when user doesn't have visibility access */}
          {!hasVisibilityAccess && (
            <span
              style={{
                color: getContrastColor(color),
                fontSize: Math.min(14, currentWidth / 15, currentHeight / 10),
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '8px',
                wordBreak: 'break-word',
                maxWidth: '100%',
                maxHeight: '100%',
                overflow: 'hidden',
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
                fontSize: Math.min(12, currentWidth / 18, currentHeight / 12),
                opacity: 0.6,
                textAlign: 'center',
                fontStyle: 'italic',
              }}
            >
              {/* Hidden Content */}
            </span>
          )}
        </div>

        {/* NodeResizer - only show when selected */}
        {selected && (
          <NodeResizer
            minWidth={MIN_WIDTH}
            minHeight={MIN_HEIGHT}
            onResize={handleResize}
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            handleStyle={{
              backgroundColor: color,
              border: `2px solid ${getContrastColor(color)}`,
              borderRadius: '3px',
              width: '8px',
              height: '8px',
            }}
            lineStyle={{
              borderColor: color,
              borderWidth: '2px',
            }}
          />
        )}
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
