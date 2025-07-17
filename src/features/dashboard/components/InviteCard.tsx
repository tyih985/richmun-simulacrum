import { Badge, Card, Group, Stack, Text } from "@mantine/core"
import { CommitteeType } from "@types";
import { ReactElement } from "react"

type InviteCardProps = {
  invite: CommitteeType;
};

export const InviteCard = ({ invite }: InviteCardProps): ReactElement => {
    return (
        <Card shadow="sm" padding="lg">
            <Group justify="space-between" mt="md" mb="xs" align="flex-start">
                <Text flex={1}>'person' invited you to {invite.shortName} ({invite.longName})</Text>
                <Badge color="grey">'time' ago</Badge>
            </Group>
            
        </Card>
    )
}