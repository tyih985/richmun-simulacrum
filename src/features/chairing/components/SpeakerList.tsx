// SpeakerList.tsx
import { Card, Stack, Text, Button, Group } from '@mantine/core';
import { ReactElement } from 'react';

type Props = {
  speakers: string[];
  onClear: () => void;
};

export const SpeakerList = ({ speakers, onClear }: Props): ReactElement => {
  return (
    <Card bg="gray.0" p="md">
      <Stack gap={'xs'}>
        <Group>
          <Text flex={1}>Current Speakers:</Text>
          {speakers.length > 0 && (
            <Button color="red" size="compact-sm" onClick={onClear}>
              Clear
            </Button>
          )}
        </Group>
        {speakers.length > 0 ? (
          speakers.map((speaker, index) => (
            <Stack align="center" justify="center" key={index}>
              <Text fw="bold">{speaker}</Text>
            </Stack>
          ))
        ) : (
          <Text c="dimmed">No speakers added yet.</Text>
        )}
      </Stack>
    </Card>
  );
};
