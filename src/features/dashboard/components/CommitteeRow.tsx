import { CommitteeDoc, UserCommitteeDoc } from '@features/types';
import { Stack, Table, Text, ActionIcon } from '@mantine/core';
import { committeeQueries } from '@mutations/yeahglo';
import { IconDoorExit, IconTrash } from '@tabler/icons-react';
import { CommitteeType } from '@types';
import { ReactElement, useEffect, useState } from 'react';



type Props = {
  userCommittee: UserCommitteeDoc;
};

const { getCommittee } = committeeQueries;

export const CommitteeRow = ({ userCommittee }: Props): ReactElement => {

  const [hovered, setHovered] = useState(false);

  useState<CommitteeType | null>(null);
    const [committee, setCommittee] = useState<CommitteeDoc | null>(null); 
  
  
     useEffect(() => {
    // Fetch committee details using committeeId
    const fetchCommitteeDetails = async () => {
      try {
        const committee = await getCommittee(userCommittee.id);
        if (committee) {
          setCommittee(committee);
        } else {
          console.error("Committee not found");
        }
      } catch (error) {
        console.error("Error fetching committee details:", error);
      }
    };
    fetchCommitteeDetails();
  }, [userCommittee]);
  

  return (
    <Table.Tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Table.Td>
        <Stack gap={2}>
          <Text size="sm">{committee ? committee.shortName : ''}</Text>
          {committee && committee.longName?.trim() && (
            <Text size="xs" c="dimmed">
              ({committee.longName})
            </Text>
          )}
        </Stack>
      </Table.Td>
      <Table.Td>
        <Text>{userCommittee.role}</Text>
      </Table.Td>
      <Table.Td> 
        {/* <Text>{committee!.startDate ? committee!.startDate.toLocaleDateString() : ''}</Text> */}
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
