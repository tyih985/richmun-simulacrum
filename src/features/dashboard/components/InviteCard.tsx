import { ReactElement, useState } from 'react';
import { Badge, Card, Group, Text, Button } from '@mantine/core';
import { committeeMutations } from '@mutations/committeeMutation';
import type { CommitteeDoc, UserCommitteeDoc } from '@features/types';

const { updateUserCommitteeInvite } = committeeMutations();

type Props = {
  uid: string;
  invite: UserCommitteeDoc;
  committee: CommitteeDoc;
};

export const InviteCard = ({ uid, invite, committee }: Props): ReactElement => {
  const [loading, setLoading] = useState(false);

  const onRespond = async (newStatus: 'accepted' | 'rejected') => {
    setLoading(true);
    try {
      await updateUserCommitteeInvite(uid, invite.id, newStatus);
    } catch (err) {
      console.error('Failed to update invite status', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" mb="md">
      <Group mb="sm">
        <Text>
          You’ve been invited to{' '}
          {committee ? `${committee.shortName} (${committee.longName})` : 'a committee'}
        </Text>
        <Badge color="gray">Pending</Badge>
      </Group>

      <Group>
        <Button
          size="xs"
          color="green"
          onClick={() => onRespond('accepted')}
          loading={loading}
        >
          Accept
        </Button>
        <Button
          size="xs"
          color="red"
          onClick={() => onRespond('rejected')}
          loading={loading}
        >
          Reject
        </Button>
      </Group>
    </Card>
  );
};
