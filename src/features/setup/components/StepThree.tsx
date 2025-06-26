import { ReactElement } from 'react';
import {
  Container,
  Flex,
  Title,
  Text,
  Space,
  Table,
  Stack,
  Button,
  Group,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import type { Delegate, SetupFormValues } from 'src/features/types';
import { ExpandableButton } from '@components/ExpandableButton';

export interface StepThreeProps {
  delegateRows: ReactElement[];
  openDelegateModal: () => void;
  setActiveModal: (mode: 'UN' | 'custom' | 'import') => void;
}

export function StepThree({
  delegateRows,
  openDelegateModal,
  setActiveModal,
}: StepThreeProps): ReactElement {
  const empty = delegateRows.length === 0;

  return (
    <Container size="sm" p="xl">
      <Flex direction="column" gap="sm">
        <Title order={3}>3. Add Countries + Delegates</Title>
        <Text size="sm">
          Add the countries and delegates that will be participating in your committee.
        </Text>

        <Space h="md" />

        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '30%' }}>Country</Table.Th>
              <Table.Th>Delegate</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{delegateRows}</Table.Tbody>
        </Table>

        {empty && (
          <Stack align="center" justify="center" p="lg" bg="gray.0">
            <Text c="dimmed">no countries added :c</Text>
            <Group>
              <Button
                onClick={() => {
                  setActiveModal('import');
                  openDelegateModal();
                }}
              >
                Import spreadsheet?
              </Button>
              <Button
                onClick={() => {
                  setActiveModal('UN');
                  openDelegateModal();
                }}
              >
                Add UN countries?
              </Button>
            </Group>
          </Stack>
        )}

        <Flex justify="flex-end" mt="md">
          <ExpandableButton
            onFirst={() => {
              setActiveModal('UN');
              openDelegateModal();
            }}
            onSecond={() => {
              setActiveModal('custom');
              openDelegateModal();
            }}
            onThird={() => {
              setActiveModal('import');
              openDelegateModal();
            }}
          />
        </Flex>
      </Flex>
    </Container>
  );
}
