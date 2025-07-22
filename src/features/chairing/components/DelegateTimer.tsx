import { TimerBar } from '@components/Timer';
import { DelegateDoc } from '@features/types';
import { Paper, Stack, Title } from '@mantine/core';
import { ReactElement } from 'react';

type Props = {
  delegate: DelegateDoc;
};

export const DelegateTimer = ({ delegate }: Props): ReactElement => {
  return (
    <Paper p="md" radius="md" withBorder>
      {/* <Text>flag</Text> TODO: bc i realize the countriesData should probably be a map bc rn its cringe and you have to iterate through the whole thing and no one wants to do that*/}
      <Stack align="center" justify="center" mb="md">
        <Title order={2}>{delegate ? delegate.name : ''}</Title>
      </Stack>
      <TimerBar></TimerBar>
    </Paper>
  );
};
