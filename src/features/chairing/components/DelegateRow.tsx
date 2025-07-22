import { ReactElement, useState } from 'react';
import { Group, Paper, Select, Text } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { committeeMutations } from '@mutations/committeeMutation';
import type { RollCallDelegateDoc, AttendanceStatus } from '@features/types';
import { Timestamp } from 'firebase/firestore';

const { addRollCallDelegateToCommittee } = committeeMutations();

type Props = {
  delegate: RollCallDelegateDoc;
};

export const DelegateRow = ({ delegate }: Props): ReactElement => {
  const { committeeId, rollCallId } = useParams<{
    committeeId: string;
    rollCallId: string;
  }>();

  const [status, setStatus] = useState<AttendanceStatus>(
    delegate.attendanceStatus
  );

  const statusColors: Record<AttendanceStatus, string> = {
    absent: '#ffc6c7',
    excused: '#ffeeb9',
    present: '#ccffb8',
  };
  const bg = statusColors[status];

  const handleChange = async (newStatus: AttendanceStatus) => {
    if (!committeeId || !rollCallId) return;
    setStatus(newStatus);
    await addRollCallDelegateToCommittee(
      committeeId,
      rollCallId,
      delegate.id,
      Timestamp.now(),
      delegate.name,
      newStatus
    );
  };

  return (
    <Paper bg={bg} p="sm" radius={0}>
      <Group>
        <Text flex={1}>{delegate.name}</Text>
        <Select
          data={['absent', 'excused', 'present']}
          value={status}
          onChange={(v) => v && handleChange(v as AttendanceStatus)}
          allowDeselect={false}
        />
      </Group>
    </Paper>
  );
};
