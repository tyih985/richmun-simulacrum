import { ReactElement, useState } from 'react';
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
  TextInput,
  CloseButton,
  Modal,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import type { Delegate, SetupFormValues } from 'src/features/types';
import { ExpandableButton } from '@components/ExpandableButton';
import { countriesData } from '@lib/countriesData';
import { useDisclosure } from '@mantine/hooks';
import { UNModalContent } from './UNModalContent';
import { CustomModalContent } from './CustomModalContent';
import { ImportSheetContent } from './ImportSheetContent';

const un_countries = countriesData;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (email: string) => emailRegex.test(email);

export interface StepThreeProps {
  form: UseFormReturnType<SetupFormValues>;
}

export function StepThree({ form }: StepThreeProps): ReactElement {
  // State for delegate modal
  const [openedDelegateModal, { open: openDelegateModal, close: closeDelegateModal }] =
    useDisclosure(false);
  const [activeModal, setActiveModal] = useState<'UN' | 'custom' | 'import' | null>(null);

  // State for available countries
  const [availableCountries, setAvailableCountries] = useState(un_countries);

  const existingCountries = new Set(form.values.delegates.map((d) => d.country));

  // State for focused delegate index
  const [focusedDelegateIdx, setFocusedDelegateIdx] = useState<number | null>(null);

  const addRows = (newDelegates: Delegate[]) => {
    console.log('adding delegates:', newDelegates);
    form.setFieldValue(
      'delegates',
      [...form.values.delegates, ...newDelegates].sort((a, b) =>
        a.country.name.localeCompare(b.country.name),
      ),
    );

    closeDelegateModal();
  };

  const removeDelegateRow = (idx: number) => {
    form.setFieldValue(
      'delegates',
      form.values.delegates.filter((_, i) => i !== idx),
    );

    setAvailableCountries(un_countries.filter((c) => !existingCountries.has(c)));
  };

  const delegateRows = form.values.delegates.map(({ country, email }, idx) => (
    <Table.Tr key={`${country}-${idx}`}>
      <Table.Td>
        <Stack gap={2}>
          <Text size="sm">{country.name}</Text>
          {country.longName?.trim() && (
            <Text size="xs" c="dimmed">
              ({country.longName})
            </Text>
          )}
        </Stack>
      </Table.Td>
      <Table.Td>
        <TextInput
          placeholder="Add delegate email here..."
          value={email}
          onChange={(e) => {
            const list = [...form.values.delegates];
            list[idx].email = e.currentTarget.value;
            form.setFieldValue('delegates', list);
          }}
          onFocus={() => setFocusedDelegateIdx(idx)}
          onBlur={() => setFocusedDelegateIdx(null)}
          error={
            idx !== focusedDelegateIdx && email.trim() !== '' && !isValidEmail(email)
              ? 'Invalid email'
              : undefined
          }
        />
      </Table.Td>
      <Table.Td>
        <CloseButton variant="outline" onClick={() => removeDelegateRow(idx)} />
      </Table.Td>
    </Table.Tr>
  ));

  const empty = delegateRows.length === 0;

  return (
    <Container size="sm" p="xl">
      <Modal
        opened={openedDelegateModal}
        onClose={closeDelegateModal}
        title={
          activeModal === 'UN'
            ? 'Add UN Countries'
            : activeModal === 'custom'
              ? 'Add Custom Country'
              : 'Import Delegates'
        }
        centered
      >
        {activeModal === 'UN' && (
          <UNModalContent
            availableCountries={availableCountries}
            setAvailableCountries={setAvailableCountries}
            addRows={addRows}
          />
        )}
        {activeModal === 'custom' && (
          <CustomModalContent
            availableCountries={availableCountries}
            setAvailableCountries={setAvailableCountries}
            addRows={addRows}
          />
        )}
        {activeModal === 'import' && (
          <ImportSheetContent
            addRows={addRows}
            availableCountries={availableCountries}
            setAvailableCountries={setAvailableCountries}
            existingCountries={existingCountries}
          />
        )}
      </Modal>
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
