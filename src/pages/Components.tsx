import { useState } from 'react';
import { ActionIcon, Button, Group, rem, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

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
      gap="xs"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: 'all 0.2s ease',
        overflow: 'hidden',
      }}
    >
      
      {hovered ? (
        <Group
        grow
        >
          <Button size="xs" color="blue" onClick={onFirst} >+UN country</Button>
          <Button size="xs" color="green" onClick={onSecond} >+custom</Button>
          <Button size="xs" color="red" onClick={onThird} >+spreadsheet</Button>
        </Group>
      ) : (
        <ActionIcon
        variant="outline"
        aria-label="Add"
        onClick={onClick}
        size="md"
      ><IconPlus style={{ width: '70%', height: '70%' }} stroke={2.5} /></ActionIcon>
      )
      }
    </Group>
  );
}

