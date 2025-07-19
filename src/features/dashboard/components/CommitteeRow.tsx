import { Table, Text, Stack, ActionIcon } from "@mantine/core";
import { IconDoorExit } from "@tabler/icons-react";
import { CommitteeDoc, UserCommitteeDoc } from "@features/types";
import { ReactElement, useState } from "react";

type Props = {
  committee: CommitteeDoc;
  userCommittee: UserCommitteeDoc;
};

export const CommitteeRow = ({ committee, userCommittee }: Props): ReactElement => {
  const [hovered, setHovered] = useState(false);
  const roleLabel = userCommittee.role === "staff" ? `staff (${userCommittee.staffRole})` : "delegate";

  return (
    <Table.Tr onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Table.Td>
        <Stack gap={2}>
          <Text size="sm">{committee?.shortName}</Text>
          {committee?.longName && <Text size="xs" c="dimmed">({committee.longName})</Text>}
        </Stack>
      </Table.Td>
      <Table.Td>
        <Text>{roleLabel}</Text>
      </Table.Td>
      <Table.Td>
        {/* <Text>{committee?.startDate?.toLocaleDateString()}</Text> */}
      </Table.Td>
      <Table.Td>
        <ActionIcon
          variant="subtle"
          style={{
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? "auto" : "none",
            transition: "opacity 0.2s ease",
            marginLeft: 8,
          }}
        >
          <IconDoorExit size={24} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
};
