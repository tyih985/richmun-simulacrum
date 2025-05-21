export type PinNodeData = {
  iconUrl?: string;
  color?: string;
  text?: string;
  coverImageUrl?: string;
  visibilityRoles: string[];
  size?: number; // not supported right now, but technically in the future
};
