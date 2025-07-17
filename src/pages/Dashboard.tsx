import { ReactElement } from "react"
import { ActionIcon, Button, Divider, Drawer, Group, Stack, Table, Text, Title } from '@mantine/core';
import { CommitteeRow } from "@features/dashboard/components/CommitteeRow";
import { IconMail, IconPlus, IconUser } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { InviteCard } from "@features/dashboard/components/InviteCard";
import { CommitteeType } from "@types";

export const Dashboard = (): ReactElement => {
    const name = 'name'; // TODO: get name from db
    
    const [opened, { open, close }] = useDisclosure(false);

    // TODO: get users committees from db
    // {userCommittees}.map(({ country, email }, idx) => (
    //     <CommitteeRow></CommitteeRow>
    // ))

    // TODO: get users invites from db
    // {userInvites}.map(({ country, email }, idx) => (
    //     <InviteCard></InviteCard>
    // ))

    const userCommittees: CommitteeType[] = [
    {
        id: '1',
        shortName: 'HR',
        longName: 'Human Resources',
    },
    {
        id: '2',
        shortName: 'IT',
        longName: '',
    },
    ];

    const userInvites: CommitteeType[] = [
    {
        id: '1',
        shortName: 'HR',
        longName: 'Human Resources',
    },
    {
        id: '2',
        shortName: 'IT',
        longName: '',
    },
    ];

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
                <Title order={1} flex={1}>Welcome Back, {name}</Title> 
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