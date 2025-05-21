import { useNodes, useReactFlow } from '@xyflow/react';
import { useMemo } from 'react';

export const useSelectedMapPins = () => {
  const nodes = useNodes();
  const { getNodes } = useReactFlow();
  const selectedNodes = useMemo(
    () => getNodes().filter((node) => node.selected),
    [nodes],
  );

  return selectedNodes;
};
