import { XYPosition } from '@xyflow/react';

export type PinNodeDataType = {
  iconUrl?: string;
  color?: string;
  text?: string;
  coverImageUrl?: string;
  visibilityFactions?: string[];
  size?: number; // not supported right now, but technically in the future
};

export type SpoilerNodeDataType = {
  color?: string;
  text?: string;
  // needs to be resizable
  height?: number
  width?: number
}

export type PostableNodeType = Partial<PinNodeDataType | SpoilerNodeDataType> & {
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