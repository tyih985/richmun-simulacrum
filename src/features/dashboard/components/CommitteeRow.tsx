import { Stack, Table, Text, ActionIcon } from '@mantine/core';
import { IconDoorExit, IconTrash } from '@tabler/icons-react';
import { CommitteeType } from '@types';
import { ReactElement, useState } from 'react';



type Props = {
  committee: CommitteeType;
};


export const CommitteeRow = ({ committee }: Props): ReactElement => {

  const [hovered, setHovered] = useState(false);

  return (
    <Table.Tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Table.Td>
        <Stack gap={2}>
          <Text size="sm">{committee.shortName}</Text>
          {committee.longName?.trim() && (
            <Text size="xs" c="dimmed">
              ({committee.longName})
            </Text>
          )}
        </Stack>
      </Table.Td>
      <Table.Td>
        <Text>{'committee.role'}</Text>
      </Table.Td>
      <Table.Td style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>{'committee.date'}</Text>
        <ActionIcon
            variant='subtle'
          style={{
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none',
            transition: 'opacity 0.2s ease',
            marginLeft: 8,
          }}
        >
          <IconDoorExit size={24} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
};

{/* <CloseButton variant="outline" onClick={() => {console.log('remove row haha..')}} /> */}