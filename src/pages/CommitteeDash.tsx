import { ReactElement } from 'react';
import { Stack, Group, Text, Button } from '@mantine/core';

export const CommitteeDash = (): ReactElement => {

  return (
    <Stack p="lg">
      <Group>
        <Stack flex={1}>
          <Text size="xl">
            Committee
          </Text>
          <Text size="sm">
            Poop
          </Text>
        </Stack>
        <Button></Button>
      </Group>
    </Stack>
  );
};
