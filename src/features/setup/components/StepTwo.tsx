import { ReactElement } from 'react';
import { Container, Flex, Title, Text, Space, Table, ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { UseFormReturnType } from '@mantine/form';
import type { Staff, SetupFormValues } from 'src/features/types';

export interface StepTwoProps {
  ownerRow: () => ReactElement;
  staffRows: ReactElement[];
  openStaffModal: () => void;
}

export function StepTwo({
  ownerRow,
  staffRows,
  openStaffModal,
}: StepTwoProps): ReactElement {
  return (
    <Container size="sm" p="xl">
      <Flex direction="column" gap="sm">
        <Title order={3}>2. Add Staff Members</Title>
        <Text size="sm">
          Add the emails of staff members who will be managing your committee.
        </Text>

        <Space h="md" />

        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '50%' }}>Staff</Table.Th>
              <Table.Th>Role</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{[ownerRow(), ...staffRows]}</Table.Tbody>
        </Table>

        <Flex justify="flex-end" mt="md">
          <ActionIcon
            variant="outline"
            size="md"
            aria-label="Add staff"
            onClick={openStaffModal}
          >
            <IconPlus stroke={2.5} />
          </ActionIcon>
        </Flex>
      </Flex>
    </Container>
  );
}
