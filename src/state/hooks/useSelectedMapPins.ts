import { useReactFlow } from '@xyflow/react';

export const useSelectedMapPins = () => {
  const { getNodes } = useReactFlow();
  const selectedNodes = getNodes().filter((node) => node.selected);

  return selectedNodes;
};
