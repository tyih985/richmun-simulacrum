import { Table, Text, Stack, ActionIcon } from '@mantine/core';
import { IconDoorExit } from '@tabler/icons-react';
import { CommitteeDoc, UserCommitteeDoc } from '@features/types';
import { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestoreTimestampToDate } from '@features/utils';

type Props = {
  committee: CommitteeDoc;
  userCommittee: UserCommitteeDoc;
};

export const CommitteeRow = ({ committee, userCommittee }: Props): ReactElement => {
  const [hovered, setHovered] = useState(false);
  const roleLabel =
    userCommittee.role === 'staff' ? `staff (${userCommittee.staffRole})` : 'delegate';
  const nav = useNavigate();

  if (!committee) return <></>;

  console.log("com:", committee.shortName, committee.startDate, committee.endDate);

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
        <Text>{committee?.startDate?.toString()}</Text>
        {/* <Text>{committee?.startDate.isEqual(committee?.endDate) ? (`${firestoreTimestampToDate(committee.startDate).toLocaleDateString()} - ${committee?.endDate?.toDate().toLocaleDateString()}`) : (firestoreTimestampToDate(committee.startDate).toLocaleDateString())}</Text>  */}
        {/* highkey in tears idk why it says isEqual is not a function for startDate :,| */}
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
