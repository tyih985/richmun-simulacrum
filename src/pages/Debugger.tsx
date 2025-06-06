import { ReactElement, useEffect } from 'react';

import { useMantineColorScheme, Button, Group, Title } from '@mantine/core';
import { useConfig } from '@hooks/useConfig';
import { useCustomTheme } from '@hooks/useCustomTheme';
import { useServiceWorker } from '@store/useServiceWorker';
import { notifications } from '@mantine/notifications';
import { useSession } from '@hooks/useSession';

const APP_UPDATE_NOTIFICATION_ID = 'version-update';

export const Debugger = (): ReactElement => {
  const config = useConfig();
  const { logout, refreshUser } = useSession();
  const { showUpdatePrompt, applyUpdate, checkForUpdates } = useServiceWorker();
  const { setColorScheme, clearColorScheme } = useMantineColorScheme();
  const { updateFontSize, updateTypography } = useCustomTheme();

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
    <div>
      <Title order={2}>{config?.site_title}</Title>
      <p>
        Build: <i>{import.meta.env.BUILD_DATE}</i>
      </p>
      <p className="read-the-docs">Empty page for PWA update mock</p>

      <Group>
        {showUpdatePrompt ? (
          <Button size="sm" variant="gradient" onClick={() => applyUpdate()}>
            Update App
          </Button>
        ) : (
          <Button size="sm" variant="gradient">
            No update available
          </Button>
        )}
        <Button size="sm" onClick={() => checkForUpdates()}>
          check for updates
        </Button>
        <Button size="sm" variant="outline" onClick={() => refreshUser()}>
          refresh user
        </Button>
        <Button size="sm" variant="outline" onClick={() => logout()}>
          logout
        </Button>
      </Group>
      <Group>
        <Button onClick={() => setColorScheme('light')}>Light</Button>
        <Button onClick={() => setColorScheme('dark')}>Dark</Button>
        <Button onClick={() => setColorScheme('auto')}>Auto</Button>
        <Button onClick={clearColorScheme}>Clear</Button>
      </Group>
      <Group>
        <Button variant="outline" onClick={() => updateFontSize(50)}>
          50% font size
        </Button>
        <Button variant="outline" onClick={() => updateFontSize(80)}>
          80% font size
        </Button>
        <Button variant="outline" onClick={() => updateFontSize(100)}>
          100% font size
        </Button>
      </Group>

      <Group>
        <Button variant="light" onClick={() => updateTypography('OpenDyslexic')}>
          OpenDyslexic
        </Button>
        <Button variant="light" onClick={() => updateTypography('Philosopher')}>
          Philosopher
        </Button>
        <Button variant="light" onClick={() => updateTypography(null)}>
          reset
        </Button>
      </Group>
    </div>
  );
};
