import { useContext } from 'react';
import { ReactFlowViewportContext } from '@context/flowViewport';

// eslint-disable-next-line react-refresh/only-export-components
export const useReactFlowViewport = () => {
  const context = useContext(ReactFlowViewportContext);
  if (!context)
    throw new Error(
      'useReactFlowViewport must be used within a ReactFlowViewportProvider',
    );
  return context;
};
