import { Table, Text, Stack, ActionIcon } from '@mantine/core';
import { IconDoorExit } from '@tabler/icons-react';
import { CommitteeDoc, UserCommitteeDoc } from '@features/types';
import { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { committeeMutations } from '@mutations/committeeMutation';
import { auth } from '@packages/firebase/firebaseAuth';

type Props = {
  committee: CommitteeDoc;
  userCommittee: UserCommitteeDoc;
};

const toString = (date?: Date | { toDate(): Date }): string => {
  if (!date) return 'no date';
  const d = 'toDate' in date ? date.toDate() : date;
  return d.toISOString().slice(0, 10);
};

export const CommitteeRow = ({ committee, userCommittee }: Props): ReactElement => {
  const [hovered, setHovered] = useState(false);
  const roleLabel =
    userCommittee.role === 'staff' ? `staff (${userCommittee.staffRole})` : 'delegate';
  const nav = useNavigate();

  const { removeUserCommittee, deleteCommittee } = committeeMutations();

  const start = toString(committee?.startDate);
  const end = toString(committee?.endDate);

  if (!committee) return <></>;

  const handleLeave = async (event: React.MouseEvent) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      userCommittee.owner
        ? `You are the owner of "${committee.shortName}". Leaving will delete the entire committee. Are you sure?`
        : `Are you sure you want to leave "${committee.shortName}"?`
    );

    if (!confirmed) return;

    try {
      if (userCommittee.owner) {
        await deleteCommittee(committee.id);
        alert(`Committee "${committee.shortName}" deleted.`);
      } else {
        await removeUserCommittee(auth.currentUser!.uid, committee.id);
        alert(`You have left the committee "${committee.shortName}".`);
      }
    } catch (error) {
      console.error('Failed to leave/delete committee:', error);
      alert('An error occurred. Please try again.');
    }
  };

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
          onClick={handleLeave}
          aria-label={userCommittee.owner ? 'Delete Committee' : 'Leave Committee'}
          color={userCommittee.owner ? 'red' : undefined}
        >
          <IconDoorExit size={24} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
};
