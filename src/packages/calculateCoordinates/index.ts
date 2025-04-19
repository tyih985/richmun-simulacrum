import { XYPosition } from '@xyflow/react';

export const getCenter = ({
  viewport,
  viewportSize,
}: {
  viewport: XYPosition & { zoom: number };
  viewportSize: { height: number; width: number };
}): XYPosition => {
  const { height, width } = viewportSize;

  const centerX = width / 2 - viewport.x * viewport.zoom;
  const centerY = height / 2 - viewport.y * viewport.zoom;

  return { x: centerX, y: centerY };
};

export const getTargetViewport = ({
  targetPosition,
  viewport,
  viewportSize,
  keepZoom,
  zoom,
}: {
  targetPosition: XYPosition;
  viewport: XYPosition & { zoom: number };
  viewportSize: { height: number; width: number };

  keepZoom?: boolean;
  zoom?: number;
}): XYPosition & { zoom: number } => {
  const { height, width } = viewportSize;
  const finalZoom = keepZoom ? viewport.zoom : (zoom ?? 1);

  const newX = targetPosition.x - width / 2 / finalZoom;
  const newY = targetPosition.y - height / 2 / finalZoom;

  return { x: newX, y: newY, zoom: finalZoom };
};
