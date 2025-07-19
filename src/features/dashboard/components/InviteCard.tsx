import { CommitteeDoc, UserCommitteeDoc } from '@features/types';
import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import { committeeQueries } from '@mutations/yeahglo';
import { CommitteeType } from '@types';
import { ReactElement, useEffect, useState } from 'react';

const { getCommittee } = committeeQueries;

type InviteCardProps = {
  invite: UserCommitteeDoc;
};

export const InviteCard = ({ invite }: InviteCardProps): ReactElement => {

  useState<CommitteeType | null>(null);
  const [committee, setCommittee] = useState<CommitteeDoc | null>(null); 


   useEffect(() => {
  // Fetch invite details using inviteId
  const fetchInviteDetails = async () => {
    try {
      const committee = await getCommittee(invite.id);
      if (committee) {
        setCommittee(committee);
      } else {
        console.error("Invite not found");
      }
    } catch (error) {
      console.error("Error fetching invite details:", error);
    }
  };
  fetchInviteDetails();
}, [invite]);


  return (
    <Card shadow="sm" padding="lg">
      <Group justify="space-between" mt="md" mb="xs" align="flex-start">
        <Text flex={1}>
          {'person'} invited you to {committee ? `${committee.shortName} (${committee.longName})` : 'a committee'}
        </Text>
        <Badge color="grey">'time' ago</Badge>
      </Group>
    </Card>
  );
};
