import { ReactElement } from "react"
import { ActionIcon, Button, Divider, Drawer, Group, Stack, Table, Text, Title } from '@mantine/core';
import { CommitteeRow } from "@features/dashboard/components/CommitteeRow";
import { IconMail, IconPlus, IconUser } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { InviteCard } from "@features/dashboard/components/InviteCard";
import { getCommitteesForUser } from "@features/dashboard/utils";
import { auth } from '@packages/firebase/firebaseAuth';

      
const uid = auth.currentUser?.uid;
console.log('Current User ID:', uid);

const name = 'name'; // TODO: get name from db

// assumes uid is defined
const userCommittees = await getCommitteesForUser(uid!, "accepted");
const userInvites = await getCommitteesForUser(uid!, "pending");

export const Dashboard = (): ReactElement => {

   const [opened, { open, close }] = useDisclosure(false);

    // const userCommittees: CommitteeType[] = [
    // {
    //     id: '1',
    //     shortName: 'HR',
    //     longName: 'Human Resources',
    // },
    // {
    //     id: '2',
    //     shortName: 'IT',
    //     longName: '',
    // },
    // ];

    // const userInvites: CommitteeType[] = [
    // {
    //     id: '1',
    //     shortName: 'HR',
    //     longName: 'Human Resources',
    // },
    // {
    //     id: '2',
    //     shortName: 'IT',
    //     longName: '',
    // },
    // ];

    return (
        <>
        <Drawer opened={opened} onClose={close} title="Your Invites" position="right">
            {userInvites.map((invite) => (
                            <InviteCard invite={invite}/>
                            ))}
        </Drawer>
        
        <Stack p="lg">
            <Group>
                <ActionIcon size="xl" variant="filled" aria-label="Profile" radius={"xl"}> 
                    <IconUser style={{ width: '70%', height: '70%' }} stroke={2} />
                </ActionIcon>
                <Title order={1} flex={1}>Welcome Back! {uid}</Title> 
                <Button 
                size="sm" 
                variant="filled"
                onClick={open} 
                rightSection={<IconMail stroke={2}/>}> 
                    See Invites
                </Button>
            </Group>
            <Divider></Divider>
            <Stack m="xl" p="xl">
                <Title order={3}>Your committees</Title>
                <Text size="sm" color="dimmed">
                    You are a member of {userCommittees.length} committees.
                </Text>
                {/* <Text size="sm" color="dimmed">{userCommittees}</Text> */}
                {/* add filter? */}
                <Stack p="lg">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                            <Table.Th style={{ width: '30%' }}>name</Table.Th>
                            <Table.Th>role</Table.Th>
                            <Table.Th>date</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {userCommittees.map((committee) => (
                            <CommitteeRow key={committee.id} committee={committee}/>
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
    )
}