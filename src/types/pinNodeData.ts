import { XYPosition } from '@xyflow/react';

export type PinNodeDataType = {
  iconUrl?: string;
  color?: string;
  text?: string;
  coverImageUrl?: string;
  visibilityRoles: string[];
  size?: number; // not supported right now, but technically in the future
};

export type FlattenedPinNodeDataType = PinNodeDataType & {
  type: 'pin' | 'draft';
  position: XYPosition;
};
