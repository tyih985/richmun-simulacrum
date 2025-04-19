import { ReactNode, useCallback, useRef } from 'react';
import { ReactFlowViewportContext, ViewportType } from '@context/flowViewport';

export const ReactFlowViewportProvider = ({ children }: { children: ReactNode }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>();
  const dimensions = useRef<ViewportType>({ width: 0, height: 0 });

  const getViewportSize = useCallback(() => dimensions.current, []);

  const refCallback = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    reactFlowWrapper.current = node; // Store reference

    // Use ResizeObserver to track viewport changes
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        dimensions.current = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <ReactFlowViewportContext.Provider value={{ refCallback, getViewportSize }}>
      {children}
    </ReactFlowViewportContext.Provider>
  );
};
