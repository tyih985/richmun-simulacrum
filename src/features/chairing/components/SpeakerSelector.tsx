// SpeakerSelector.tsx
import { DelegateDoc } from '@features/types';
import { Button, Stack, Text, Card, Space } from '@mantine/core';
import { ReactElement } from 'react';

type Props = {
  delegates: DelegateDoc[];
  onAddSpeaker: (delegate: DelegateDoc) => void;
  currentSpeakers?: string[];
};

export const SpeakerSelector = ({
  delegates,
  onAddSpeaker,
  currentSpeakers,
}: Props): ReactElement => {
  return (
    <Card bg="gray.0" p="md">
      <Stack gap={0}>
        <Text>Add Speakers:</Text>
        <Space p={'4px'}></Space>
        {delegates.map((d) => (
          <Button
            variant="subtle"
            size="compact-md"
            key={d.id}
            disabled={currentSpeakers?.includes(d.name)}
            onClick={() => onAddSpeaker(d)}
            radius={0}
          >
            {d.name}
          </Button>
        ))}
      </Stack>
    </Card>
  );
};
