import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { CommitteeDoc, UserCommitteeDoc } from "@features/types";
import { ReactElement } from "react";

type Props = {
  invite: UserCommitteeDoc;
  committee?: CommitteeDoc;
};

export const InviteCard = ({ invite, committee }: Props): ReactElement => {
  return (
    <Card shadow="sm" padding="lg">
      <Group justify="space-between" mt="md" mb="xs" align="flex-start">
        <Text flex={1}>
          Someone invited you to {committee ? `${committee.shortName} (${committee.longName})` : "a committee"}
        </Text>
        <Badge color="grey">"time ago"</Badge>
      </Group>
    </Card>
  );
};
