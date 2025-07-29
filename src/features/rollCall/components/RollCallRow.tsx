import { ReactElement } from 'react';
import { Paper, Group, Text } from '@mantine/core';
import type { RollCallDoc } from '@features/types';

type Props = {
  rollCall: RollCallDoc;
  onClick: () => void;
};

export const RollCallRow = ({ rollCall, onClick }: Props): ReactElement => {
  const date = new Date(rollCall.timestamp.seconds * 1000);
  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Group>
        <Text>Roll Call {date.toLocaleString()}</Text>
      </Group>
    </Paper>
  );
};
