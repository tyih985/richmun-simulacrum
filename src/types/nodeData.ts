import { XYPosition } from '@xyflow/react';

export type PinNodeDataType = {
  iconUrl?: string;
  color?: string;
  text?: string;
  coverImageUrl?: string;
  visibilityRoles?: string[];
  size?: number; // not supported right now, but technically in the future
};

export type PostablePinNodeType = Partial<PinNodeDataType> & {
  id?: string
  type: 'pin'
  position: XYPosition;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BackgroundNodeDataType = any

export type PostableBackgroundNode = Partial<BackgroundNodeDataType> & {
  id?: string
  position: XYPosition;
};