import { Suspense, FC, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import { ReactFlowProvider } from '@xyflow/react';

import { ConfigProvider } from '@providers/configProvider';
import { ThemeProvider } from '@providers/themeProvider';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers: FC<ProvidersProps> = ({ children }: ProvidersProps) => (
  <ConfigProvider>
    <BrowserRouter>
      <ThemeProvider>
        <Notifications position="bottom-right" zIndex={1000} limit={5} autoClose={3000} />
        <ReactFlowProvider>
          <Suspense>{children}</Suspense>
        </ReactFlowProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ConfigProvider>
);
