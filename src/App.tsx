import { Suspense, useEffect } from 'react';
import Helmet from 'react-helmet';
import { notifications } from '@mantine/notifications';

import { useConfig } from '@hooks/useConfig';
import { Button, ColorSchemeScript, Group } from '@mantine/core';
import { RootRoutes } from '@pages';
import { useServiceWorker } from '@store/useServiceWorker';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@xyflow/react/dist/style.css';
import './extra-fonts.css';
import './global.css';

const APP_UPDATE_NOTIFICATION_ID = 'version-update';

const App = () => {
  const config = useConfig();
  const { showUpdatePrompt, applyUpdate } = useServiceWorker();

  useEffect(() => {
    if (showUpdatePrompt)
      notifications.show({
        id: APP_UPDATE_NOTIFICATION_ID,
        autoClose: false,
        title: 'New Application Version available',
        message: (
          <Group justify="flex-start">
            <Button size="sm" variant="gradient" onClick={() => applyUpdate()}>
              Update App
            </Button>
          </Group>
        ),
      });
    else notifications.hide(APP_UPDATE_NOTIFICATION_ID);
  }, [applyUpdate, showUpdatePrompt]);

  return (
    <>
      <Helmet>
        <ColorSchemeScript />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href={config.favicon_url} />
        <link rel="apple-touch-icon" href={config.favicon_url} />
      </Helmet>

      <Suspense fallback={<p>Loading...</p>}>
        <RootRoutes />
      </Suspense>
    </>
  );
};

export default App;
