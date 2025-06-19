import { useState } from 'react';
import { ActionIcon, Button, Group, Stack } from '@mantine/core';
import {IconPlus } from '@tabler/icons-react';



export function ExpandableButton({
  onClick,
  onFirst,
  onSecond,
  onThird,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFirst?: React.MouseEventHandler<HTMLButtonElement>;
  onSecond?: React.MouseEventHandler<HTMLButtonElement>;
  onThird?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Group 
      p={'md'}
      gap="xs"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: 'all 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {hovered ? (
        <Stack 
        >
          <Button variant='outline' size="xs" onClick={onFirst} > add UN country</Button>
          <Button variant='outline' size="xs" onClick={onSecond} > add custom country</Button>
          <Button variant='outline' size="xs" onClick={onThird} > import spreadsheet</Button>
        </Stack>
      ) : (
        <ActionIcon variant="outline" aria-label="Add" onClick={onClick} size="md">
          <IconPlus style={{ width: '70%', height: '70%' }} stroke={2.5} />
        </ActionIcon>
      )}
    </Group>
  );
}
