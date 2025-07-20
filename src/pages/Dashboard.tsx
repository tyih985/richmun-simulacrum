import { ReactElement } from "react";
import { ActionIcon, Button, Divider, Drawer, Group, Stack, Table, Text, Title } from "@mantine/core";
import { IconMail, IconPlus, IconUser } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useUserCommittees } from "@hooks/useNewStuff";
import { CommitteeRow } from "@features/dashboard/components/CommitteeRow";
import { InviteCard } from "@features/dashboard/components/InviteCard";
import { auth } from "@packages/firebase/firebaseAuth";
import { UserCommitteeDoc } from "@features/types";
import { useNavigate } from "react-router-dom";

export const Dashboard = (): ReactElement => {
  const uid = auth.currentUser?.uid;
  const [opened, { open, close }] = useDisclosure(false);

  const { userCommittees, userInvites, committeeDocs, loading } = useUserCommittees(
    uid ?? '',
  );

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Your Invites" position="right">
        {userInvites.map((invite: UserCommitteeDoc) => (
          <InviteCard
            key={invite.id}
            invite={invite}
            committee={committeeDocs[invite.id]}
          />
        ))}
      </Drawer>

      <Stack p="lg">
        <Group>
          <ActionIcon size="xl" variant="filled" aria-label="Profile" radius="xl">
            <IconUser style={{ width: '70%', height: '70%' }} stroke={2} />
          </ActionIcon>
          <Title order={1} flex={1}>
            Welcome Back! {uid}
          </Title>
          <Button
            size="sm"
            variant="filled"
            onClick={open}
            rightSection={<IconMail stroke={2} />}
          >
            See Invites
          </Button>
        </Group>
        <Divider />
        <Stack m="xl" p="xl">
          <Title order={3}>Your committees</Title>
          <Text size="sm" color="dimmed">
            You are a member of {userCommittees.length} committee(s).
          </Text>
          <Stack p="lg">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: '30%' }}>name</Table.Th>
                  <Table.Th>role</Table.Th>
                  <Table.Th>date</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {userCommittees.map((uc) => (
                  <CommitteeRow
                    key={uc.id}
                    committee={committeeDocs[uc.id]}
                    userCommittee={uc}
                  />
                ))}
              </Table.Tbody>
            </Table>
            <Group justify="flex-end">
              <ActionIcon variant="filled" aria-label="Add Committee">
                <IconPlus style={{ width: '70%', height: '70%' }} stroke={2} />
              </ActionIcon>
            </Group>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
