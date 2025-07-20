import { CommitteeDoc } from '@features/types';
import { Stack, Table, Text, ActionIcon } from '@mantine/core';
import { IconDoorExit, IconTrash } from '@tabler/icons-react';
import { ReactElement, useState } from 'react';



type Props = {
  committee: CommitteeDoc;
};


export const DelegateRow = ({ committee }: Props): ReactElement => {

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
      <Table.Td> 
        <Text>{'committee.startDate'}</Text>
      </Table.Td>
      <Table.Td>
        <ActionIcon
          variant="subtle"
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

{
  /* <CloseButton variant="outline" onClick={() => {console.log('remove row haha..')}} /> */
}
