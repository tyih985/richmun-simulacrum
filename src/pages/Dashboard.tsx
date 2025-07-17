import { ReactElement } from "react"
import { ActionIcon, Divider, Stack, Text } from '@mantine/core';
import { CommitteeRow } from "@features/dashboard/CommitteeRow";
import { IconPlus } from "@tabler/icons-react";

export const Dashboard = (): ReactElement => {
    const name = 'name'; // TODO: get name from db

    return (
        <Stack p="lg">
            <Text size="xl">Welcome Back, {name}</Text>
            <Divider></Divider>
            <Stack p="lg">
                <Text>Your committees</Text>
                {/* add filter? */}
                <Stack p="lg">
                    <CommitteeRow></CommitteeRow>
                    <ActionIcon variant="filled" aria-label="Settings">
                        <IconPlus style={{ width: '70%', height: '70%' }} stroke={2} />
                    </ActionIcon>
                </Stack>
            </Stack>
            
        </Stack>
    )
}