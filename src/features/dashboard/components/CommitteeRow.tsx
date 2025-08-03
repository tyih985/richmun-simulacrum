import { Table, Text, Stack, ActionIcon } from '@mantine/core';
import { IconDoorExit } from '@tabler/icons-react';
import { CommitteeDoc, UserCommitteeDoc } from '@features/types';
import { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';

type Props = {
  committee: CommitteeDoc;
  userCommittee: UserCommitteeDoc;
};

const toString = (date?: Date | Timestamp): string => {
  if (!date) {
    return 'no date';
  }
  const d = (date instanceof Timestamp ? date.toDate() :date);
  return d.toISOString().slice(0, 10);
};

export const CommitteeRow = ({ committee, userCommittee }: Props): ReactElement => {
  const [hovered, setHovered] = useState(false);
  const roleLabel =
    userCommittee.role === 'staff' ? `staff (${userCommittee.staffRole ?? ''})` : 'delegate';
  const nav = useNavigate();

  const start = toString(committee?.startDate);
  const end = toString(committee?.endDate);

  if (!committee) return <></>;

  return (
    <Table.Tr
      onClick={() => nav(`/committee/${committee.id}/dashboard`)}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Table.Td>
        <Stack gap={2}>
          <Text size="sm">{committee?.shortName}</Text>
          {committee?.longName && (
            <Text size="xs" c="dimmed">
              ({committee.longName})
            </Text>
          )}
        </Stack>
      </Table.Td>
      <Table.Td>
        <Text>{roleLabel}</Text>
      </Table.Td>
      <Table.Td>
        <Text>{start === end ? start : start + ' to ' + end}</Text>
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
