import { TimerBar } from "@components/Timer";
import { DelegateDoc } from "@features/types";
import { Paper, Stack, Title } from "@mantine/core";
import { ReactElement } from "react";

type Props = {
  delegate: DelegateDoc;
  onStart?: () => void;
  onComplete?: () => void;
};

export const DelegateTimer = ({ delegate, onStart, onComplete }: Props): ReactElement => {
  return (
    <Paper p="md" radius="md" withBorder>
      <Stack align="center" justify="center" mb="md">
        <Title order={2}>{delegate.name}</Title>
      </Stack>
      <TimerBar onStart={onStart} onComplete={onComplete} />
    </Paper>
  );
};

