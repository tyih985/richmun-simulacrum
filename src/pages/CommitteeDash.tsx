import {
  Stack,
  Group,
  Text,
  Button,
  Divider,
  Title,
  Table,
  Container,
  Loader,
  TextInput,
  ActionIcon,
  CloseButton,
  Flex,
  Modal,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { DateInputComponent } from '@components/DateInput';
import { useForm } from '@mantine/form';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type {
  Country,
  Delegate,
  Staff,
  SetupFormValues,
} from '@features/types';
import type { CommitteeDoc } from '@features/types';
import { auth } from '@packages/firebase/firebaseAuth';
import { StaffModalContent } from '@features/committeeDash/components/ModalContentStaff';
import { UNModalContent } from '@features/committeeDash/components/ModalContentUN';
import { StaffRow } from '@features/committeeDash/components/StaffRow';
import { DelegateRow } from '@features/committeeDash/components/DelegateRow';
import { committeeQueries } from '@mutations/yeahglo';

export const CommitteeDash = () => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const [loading, setLoading] = useState(true);
  const [committee, setCommittee] = useState<CommitteeDoc | null>(null);
  const [openedStaffModal, setOpenedStaffModal] = useState(false);
  const [openedDelegateModal, setOpenedDelegateModal] = useState(false);
  const [staffValues, setStaffValues] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);

  const form = useForm<SetupFormValues>({
    initialValues: {
      committeeLongName: '',
      committeeShortName: '',
      staff: [],
      delegates: [],
      dateRange: [null, null],
    },
    validate: {
      committeeLongName: (v) => (v.trim() ? null : 'Required'),
      committeeShortName: (v) => (v.trim() ? null : 'Required'),
    },
  });

  useEffect(() => {
    (async () => {
      if (!auth.currentUser || !committeeId) {
        setLoading(false);
        return;
      }
      try {
        const c = await committeeQueries.getCommittee(committeeId);
        if (!c) return;
        setCommittee(c);
        const [staffDocs, delegateDocs] = await Promise.all([
          committeeQueries.getCommitteeStaff(committeeId),
          committeeQueries.getCommitteeDelegates(committeeId),
        ]);
        const staffFE: Staff[] = (staffDocs || []).map((d) => ({
          staffRole: d.staffRole,
          email: d.email,
        }));
        const delegatesFE: Delegate[] = (delegateDocs || []).map((d) => ({
          country: { value: d.id, name: d.name },
          email: d.email,
        }));
        form.setValues({
          committeeLongName: c.longName,
          committeeShortName: c.shortName,
          staff: staffFE,
          delegates: delegatesFE,
          dateRange: [new Date(c.startDate), new Date(c.endDate)],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [committeeId]);

  const removeStaff = (idx: number) =>
    form.setFieldValue(
      'staff',
      form.values.staff.filter((_, i) => i !== idx)
    );

  const removeDelegate = (idx: number) =>
    form.setFieldValue(
      'delegates',
      form.values.delegates.filter((_, i) => i !== idx)
    );

  const addStaffRows = () => {
    const newRows: Staff[] = staffValues.map((email) => ({
      staffRole: 'flex staff',
      email,
    }));
    form.setFieldValue('staff', [...form.values.staff, ...newRows]);
    setStaffValues([]);
    setOpenedStaffModal(false);
  };

  const addDelegateRows = (rows: Delegate[]) => {
    const existing = new Set(form.values.delegates.map((d) => d.country.value));
    const unique = rows.filter((r) => !existing.has(r.country.value));
    form.setFieldValue('delegates', [...form.values.delegates, ...unique]);
    setOpenedDelegateModal(false);
  };

  const handleSaveChanges = async () => {
    // TODO: implement persistence mapping front-end values to backend mutations
  };

  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }
  if (!committee) {
    return (
      <Container>
        <Title>Error: Committee not found</Title>
      </Container>
    );
  }

  return (
    <Stack p="lg">
      <Group>
        <Stack>
          <Title size="xl">Committee Details</Title>
          <Text size="sm">Overview of your committee</Text>
        </Stack>
        <Button>Launch</Button>
      </Group>
      <Divider />

      <Table striped withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Field</Table.Th>
            <Table.Th>Value</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Long Name</Table.Td>
            <Table.Td>
              <TextInput {...form.getInputProps('committeeLongName')} radius="sm" />
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Short Name</Table.Td>
            <Table.Td>
              <TextInput {...form.getInputProps('committeeShortName')} radius="sm" />
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Event Dates</Table.Td>
            <Table.Td>
              <DateInputComponent
                value={form.values.dateRange}
                onChange={(r) => form.setFieldValue('dateRange', r!)}
                radius="sm"
              />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Stack>
        <Title order={3}>Staff</Title>
        <Flex justify="flex-end" mb="xs">
          <ActionIcon onClick={() => setOpenedStaffModal(true)}>
            <IconPlus />
          </ActionIcon>
        </Flex>
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Role</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {form.values.staff.map((_, i) => (
              <Table.Tr key={i}>
                <Table.Td>
                  <StaffRow form={form as any} index={i} />
                </Table.Td>
                <Table.Td />
                <Table.Td>
                  <CloseButton onClick={() => removeStaff(i)} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>

      <Stack>
        <Title order={3}>Delegates</Title>
        <Flex justify="flex-end" mb="xs">
          <ActionIcon onClick={() => setOpenedDelegateModal(true)}>
            <IconPlus />
          </ActionIcon>
        </Flex>
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Country</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {form.values.delegates.map((_, i) => (
              <Table.Tr key={i}>
                <Table.Td>
                  <DelegateRow form={form as any} index={i} />
                </Table.Td>
                <Table.Td />
                <Table.Tr>
                  <Table.Td>
                    <CloseButton onClick={() => removeDelegate(i)} />
                  </Table.Td>
                </Table.Tr>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>

      <Button onClick={handleSaveChanges}>Save Changes</Button>

      <Modal opened={openedStaffModal} onClose={() => setOpenedStaffModal(false)} title="Add Staff">
        <StaffModalContent onTagChange={setStaffValues} onSubmit={addStaffRows} />
      </Modal>

      <Modal
        opened={openedDelegateModal}
        onClose={() => setOpenedDelegateModal(false)}
        title="Add Delegates"
      >
        <UNModalContent
          availableCountries={availableCountries}
          setAvailableCountries={setAvailableCountries}
          addRows={addDelegateRows}
        />
      </Modal>
    </Stack>
  );
};
