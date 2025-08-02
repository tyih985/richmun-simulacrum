// SpeakerList.tsx
import { Card, Stack, Text, Button, Group, CloseButton } from '@mantine/core';
import { ReactElement } from 'react';

type Props = {
  speakers: string[];
  onClear: () => void;
  onRemove?: (id: string) => void
};

export const SpeakerList = ({ speakers, onClear, onRemove }: Props): ReactElement => {
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
            <Stack align="center" justify="center" key={speaker}>
              <Group>
                <Text fw="bold">{speaker}</Text>
                {/* <CloseButton onClick={() => onRemove(speaker)}></CloseButton> */}
              </Group>
            </Stack>
          ))
        ) : (
          <Text c="dimmed">No speakers added yet.</Text>
        )}
      </Stack>
    </Card>
  );
};
