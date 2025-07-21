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
  CloseButton,
  Flex,
  Modal,
} from '@mantine/core';
import { DateInputComponentNonRequired } from '@components/DateInput';
import { useForm } from '@mantine/form';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import type { Country, Delegate, Staff, SetupFormValues } from '@features/types';
import type { CommitteeDoc } from '@features/types';
import { auth } from '@packages/firebase/firebaseAuth';
import { StaffModalContent } from '@features/committeeDash/components/ModalContentStaff';
import { UNModalContent } from '@features/committeeDash/components/ModalContentUN';
import { CustomModalContent } from '@features/committeeDash/components/ModalContentCustom';
import { ImportSheetContent } from '@features/committeeDash/components/ModalContentImport';
import { StaffRow } from '@features/committeeDash/components/StaffRow';
import { DelegateRow } from '@features/committeeDash/components/DelegateRow';
import { committeeQueries } from '@mutations/yeahglo';
import { countriesData } from '@lib/countriesData';
import { committeeMutations } from '@mutations/committeeMutation';

const un_countries = countriesData;
const { createCommittee, addStaffToCommittee, removeStaffFromCommittee, addDelegateToCommittee, removeDelegateFromCommittee } = committeeMutations();

export const CommitteeDash = () => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const [loading, setLoading] = useState(true);
  const [committee, setCommittee] = useState<CommitteeDoc | null>(null);
  const [owner, setOwner] = useState<{
    uid: string;
    email: string;
    staffRole: string;
  } | null>(null);

  const [openedStaffModal, { open: openStaffModal, close: closeStaffModal }] =
    useDisclosure(false);
  const [openedDelegateModal, { open: openDelegateModal, close: closeDelegateModal }] =
    useDisclosure(false);
  const [activeModal, setActiveModal] = useState<'UN' | 'custom' | 'import' | null>('UN');

  const [staffValues, setStaffValues] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<Country[]>(un_countries);

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
      dateRange: (v) => (v[0] && v[1] ? null : 'Start and end dates required'),
      staff: {
        email: (value) => (value.trim() ? null : 'Email is required'),
      },
    },
  });

  const isFormValid =
    form.isValid() &&
    form.values.staff.every((s) => s.email.trim()) &&
    form.values.committeeLongName.trim() &&
    form.values.committeeShortName.trim() &&
    form.values.dateRange[0] &&
    form.values.dateRange[1];


  // TODO: seems scuffed 
  useEffect(() => {
    (async () => {
      if (!auth.currentUser || !committeeId) {
        setLoading(false);
        return;
      }
      const c = await committeeQueries.getCommittee(committeeId);
      if (!c) {
        setLoading(false);
        return; 
      }
      setCommittee(c);

      const [staffDocs, delegateDocs] = await Promise.all([
        committeeQueries.getCommitteeStaff(committeeId),
        committeeQueries.getCommitteeDelegates(committeeId),
      ]);

      const ownerDoc = staffDocs.find((d) => d.owner) ?? null;
      const otherStaff = staffDocs.filter((d) => !d.owner);

      if (ownerDoc) {
        setOwner({
          uid: ownerDoc.id,
          email: ownerDoc.email,
          staffRole: ownerDoc.staffRole,
        });
      } else {
        setOwner(null);
      }

      form.setValues({
        committeeLongName: c.longName,
        committeeShortName: c.shortName,
        staff: otherStaff.map((d) => ({ staffRole: d.staffRole, email: d.email })),
        delegates: delegateDocs.map((d) => ({
          country: { value: d.id, name: d.name },
          email: d.email,
        })),
        dateRange: [new Date(c.startDate), new Date(c.endDate)],
      });

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const used = new Set(form.values.delegates.map((d) => d.country.name));
    setAvailableCountries(countriesData.filter((c) => !used.has(c.name)));
  }, [form.values.delegates]);

  const removeStaff = async (i: number) => {
    await removeStaffFromCommittee(committeeId!, form.values.staff[i].email)
    console.log('removing staff', form.values.staff[i].email);
    form.setFieldValue(
      'staff',
      form.values.staff.filter((_, idx) => idx !== i),
    )
  }

  const removeDelegate = async (i: number) => {
    await removeDelegateFromCommittee(committeeId!, form.values.staff[i].email)
    console.log('removing delegate', form.values.delegates[i].country.name)
    form.setFieldValue(
      'delegates',
      form.values.delegates.filter((_, idx) => idx !== i),
    );
  };

  const addStaffRows = () => {
    const newRows: Staff[] = staffValues.map((email) => ({
      staffRole: 'flex staff',
      email,
    }));
    form.setFieldValue('staff', [...form.values.staff, ...newRows]);
    setStaffValues([]);
    closeStaffModal();
  };

  const addRows = (rows: Delegate[]) => {
    const existing = new Set(form.values.delegates.map((d) => d.country.value));
    const unique = rows.filter((r) => !existing.has(r.country.value));
    form.setFieldValue('delegates', [...form.values.delegates, ...unique]);
    closeDelegateModal();
  };

  const handleSaveChanges = async () => {
    if (!committeeId) return;
    if (!isFormValid) return;
    const { committeeLongName, committeeShortName, dateRange } = form.values;

    if (dateRange[0] && dateRange[1]) {
      console.log('Committee daterange:', dateRange);
      await createCommittee(
        committeeId,
        committeeLongName,
        committeeShortName,
        dateRange[0],
        dateRange[1]
      );
      console.log('Committee updated:', committeeId, dateRange);
      form.reset();
    }

    for (const staff of form.values.staff) {
      await addStaffToCommittee(
        committeeId,
        'staff-id', // This should be replaced with actual staff ID logic
        false,
        staff.staffRole,
        staff.email,
      );
      console.log(`Added staff: ${staff.email}`);
    }

    for (const delegate of form.values.delegates) {
      await addDelegateToCommittee(
        committeeId,
        'delegate-id', // This should be replaced with actual ID logic
        delegate.country.name,
        delegate.email,
      );
      console.log(`Added delegate: ${delegate.country.name}`);
    }
  };

  if (loading)
    return (
      <Container>
        <Loader />
      </Container>
    );
  if (!committee)
    return (
      <Container>
        {/* if no committee found do we just redirect to a diff page */}
        <Title>Error: Committee not found</Title> 
      </Container>
    );

  return (
    <Stack p="lg">
      <Modal
        opened={openedStaffModal}
        onClose={closeStaffModal}
        title="Add Staff Members"
        centered
        size="lg"
      >
        <StaffModalContent onTagChange={setStaffValues} onSubmit={addStaffRows} />
      </Modal>

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
        size="lg"
      >
        <Group mb="md">
          <Button
            variant={activeModal === 'UN' ? 'filled' : 'outline'}
            onClick={() => setActiveModal('UN')}
          >
            UN
          </Button>
          <Button
            variant={activeModal === 'custom' ? 'filled' : 'outline'}
            onClick={() => setActiveModal('custom')}
          >
            Custom
          </Button>
          <Button
            variant={activeModal === 'import' ? 'filled' : 'outline'}
            onClick={() => setActiveModal('import')}
          >
            Import
          </Button>
        </Group>

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
            availableCountries={availableCountries}
            setAvailableCountries={setAvailableCountries}
            existingCountries={new Set(form.values.delegates.map((d) => d.country))}
            addRows={addRows}
          />
        )}
      </Modal>

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
              <DateInputComponentNonRequired
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
          <Button variant="outline" onClick={openStaffModal}>
            Add Staff
          </Button>
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
            {/* -- Owner row, editable only by the owner user -- */}
            {owner && (
              <Table.Tr key="owner">
                <Table.Td>
                  <Text fw={700}>Owner</Text>
                </Table.Td>
                <Table.Td>
                  {auth.currentUser?.email === owner.email ? (
                    <TextInput
                      value={owner.email}
                      onChange={(evt) =>
                        setOwner((o) => o && { ...o, email: evt.currentTarget.value })
                      }
                      radius="sm"
                    />
                  ) : (
                    <Text>{owner.email}</Text>
                  )}
                </Table.Td>
                <Table.Td>
                  {/* No delete button for the owner */}
                </Table.Td>
              </Table.Tr>
            )}

            {/* -- Other staff rows -- */}
            {form.values.staff.map((_, i) => (
              <Table.Tr key={i}>
                  <StaffRow form={form as any} index={i} />
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
          <Button
            variant="outline"
            onClick={() => {
              setActiveModal('UN');
              openDelegateModal();
            }}
          >
            Add Delegate
          </Button>
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
                  <DelegateRow form={form as any} index={i} />
                <Table.Td>
                  <CloseButton onClick={() => removeDelegate(i)} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>

      <Button onClick={handleSaveChanges} disabled={!isFormValid}>
        Save Changes
      </Button>
    </Stack>
  );
};