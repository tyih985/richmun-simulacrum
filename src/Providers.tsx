import { Suspense, FC, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ConfigProvider } from '@providers/configProvider';
import { ThemeProvider } from '@providers/themeProvider';
import { Notifications } from '@mantine/notifications';
import { ReactFlowProvider } from '@xyflow/react';
import { ReactFlowViewportProvider } from '@providers/flowViewportProvider';
import { FocusProvider } from '@providers/selectedFocusProvider';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers: FC<ProvidersProps> = ({ children }: ProvidersProps) => (
  <ConfigProvider>
    <BrowserRouter>
      <ThemeProvider>
        <Notifications position="bottom-right" zIndex={1000} limit={5} autoClose={3000} />
        <FocusProvider>
          <ReactFlowProvider>
            <ReactFlowViewportProvider>
              <Suspense>{children}</Suspense>
            </ReactFlowViewportProvider>
          </ReactFlowProvider>
        </FocusProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ConfigProvider>
);
