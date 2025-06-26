import { ReactElement, useEffect, useRef, useState } from 'react';
import '@mantine/dates/styles.css';
import { useForm } from '@mantine/form';
import {
  Container,
  Stack,
  Title,
  TextInput,
  Button,
  Table,
  Text,
  Flex,
  TagsInput,
  Space,
  Group,
  Modal,
  Stepper,
  CloseButton,
  Box,
  FileInput,
  Image,
  Select,
  ActionIcon,
  Loader,
  Textarea,
  SegmentedControl,
} from '@mantine/core';
import {
  IconArrowRight,
  IconAt,
  IconFileSpreadsheet,
  IconPlus,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableButton } from '../components/ExpandableButton';
import { committeeMutations } from '@mutations/setUpMutation';
import {
  generateCommitteeId,
  generateDelegateId,
  generateStaffId,
} from '@packages/generateIds';
import { DateInputComponent } from '@components/DateInput';
import { ImageUploader } from '@components/ImageUploader';
import { countriesData } from '@lib/countriesData.ts';
import { auth } from '@packages/firebase/firebaseAuth';
import { parseFile, parseTSV } from '@lib/SpreadsheetThings';
import { CountryMultiSelect } from '@components/CountryMultiSelect';
import { StepOne } from '/Users/tyleryih/simulacrum/src/features/setup/components/StepOne.tsx';
import { StepTwo } from '/Users/tyleryih/simulacrum/src/features/setup/components/StepTwo.tsx';
import { StepThree } from '/Users/tyleryih/simulacrum/src/features/setup/components/StepThree.tsx';
import { Country, Delegate, Staff } from 'src/features/types';
import { StaffModalContent } from 'src/features/setup/components/StaffModalContent';
import { UNModalContent } from 'src/features/setup/components/UNModalContent';
import { CustomModalContent } from 'src/features/setup/components/CustomModalContent';
import { ImportSheetContent } from 'src/features/setup/components/ImportSheetContent';

const ROLE_OPTIONS = ['director', 'assistant director', 'flex staff'] as const;
type RoleOption = (typeof ROLE_OPTIONS)[number];
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const isValidEmail = (email: string) => emailRegex.test(email);

const un_countries = countriesData;

const {
  createCommittee,
  addStaffToCommittee,
  addDelegateToCommittee,
  addUserCommittee,
  getOrCreateUidFromEmail,
  ultimateConsoleLog,
} = committeeMutations();

export const Mock = (): ReactElement => {
  const form = useForm({
    initialValues: {
      committeeLongName: '',
      committeeShortName: '',
      staff: [] as Staff[],
      delegates: [] as Delegate[],
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      committeeLongName: (v) => (v.trim() ? null : 'Required'),
      committeeShortName: (v) => (v.trim() ? null : 'Required'),
    },
  });

  // State for owner role
  const [ownerRole, setOwnerRole] = useState<RoleOption>('director');

  // State for loading state
  const [loading, setLoading] = useState(false);

  // State for focused delegate index
  const [focusedDelegateIdx, setFocusedDelegateIdx] = useState<number | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // committee
      const committeeId = generateCommitteeId(form.values.committeeShortName.trim());
      const [startDate, endDate] = form.values.dateRange;
      await createCommittee(
        committeeId,
        form.values.committeeLongName,
        form.values.committeeShortName,
        startDate!,
        endDate!,
      );

      const ownerUid = auth.currentUser?.uid || '';
      if (ownerUid) {
        const ownerStaffId = generateStaffId();
        await addStaffToCommittee(committeeId, ownerStaffId, true, ownerRole, ownerUid);
        await addUserCommittee(ownerUid, committeeId, 'staff');
        console.log('Added owner to committee:', { ownerUid, ownerStaffId, ownerRole });
      }

      // staff
      const staffTasks = form.values.staff.map(async ({ role, email }) => {
        const uid = await getOrCreateUidFromEmail(email);
        console.log(`Using user ${uid} for staff email ${email}.`);

        const staffId = generateStaffId();
        await addStaffToCommittee(committeeId, staffId, false, role, uid);
        if (uid) {
          await addUserCommittee(uid, committeeId, 'staff');
        }
      });

      // delegates
      const delegateTasks = form.values.delegates.map(async ({ country, email }) => {
        const uid = await getOrCreateUidFromEmail(email);
        console.log(`Using user ${uid} for delegate email ${email}.`);

        const delegateId = generateDelegateId(country.name);
        await addDelegateToCommittee(committeeId, delegateId, country.name, uid);
        if (uid) {
          await addUserCommittee(uid, committeeId, 'delegate');
        }
      });

      await Promise.all([...staffTasks, ...delegateTasks]);
      await ultimateConsoleLog();
      form.reset();
      console.log('Form reset; flow complete.');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    } finally {
      setLoading(false);
    }
  };

  // State for delegate modal
  const [openedDelegateModal, { open: openDelegateModal, close: closeDelegateModal }] =
    useDisclosure(false);
  const [activeModal, setActiveModal] = useState<'UN' | 'custom' | 'import' | null>(null);

  // State for staff
  const [staffValues, setStaffValues] = useState<string[]>([]);
  const [openedStaffModal, { open: openStaffModal, close: closeStaffModal }] =
    useDisclosure(false);

  // State for UN countries
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // State for custom countries
  const [customValues, setCustomValues] = useState<string>('');

  const [importedValues, setImportedValues] = useState<Record<string, unknown>[]>([]);

  // State for available countries
  const [availableCountries, setAvailableCountries] = useState<Country[]>(un_countries);

  const existingCountries = new Set(form.values.delegates.map((d) => d.country.name));

  // State for flag things
  // const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // // State for CSV output from PasteToCSV
  // const [csv, setCsv] = useState('');

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const raw = event.clipboardData.getData('Text');
    const json = parseTSV(raw);
    console.log('Parsed JSON from pasted:', json);
    readImported(json);
  };

  // Enter key to blur active element ?? idk how useful this will be
  const multiSelectRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        // Only blur if this MultiSelect is focused
        if (
          document.activeElement === multiSelectRef.current ||
          multiSelectRef.current?.contains(document.activeElement)
        ) {
          multiSelectRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // !TEST !TEST! TEST! these r for testing
  useEffect(() => {
    console.log('selected values updated:', selectedValues);
  }, [selectedValues]);
  useEffect(() => {
    console.log('custom values updated:', customValues);
  }, [customValues]);

  const delegateRows = form.values.delegates.map(({ country, email }, idx) => (
    <Table.Tr key={`${country}-${idx}`}>
      <Table.Td>
        <Stack gap={2}>
          <Text size="sm">{country.name}</Text>
          {/* {un_countries.?.trim() && (
            <Text size="xs" c="dimmed">
              ({UN_COUNTRY_LONG_NAMES[country]})
            </Text>
          )} */}
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
          // error={
          //   idx !== focusedDelegateIdx && email.trim() !== '' && !isValidEmail(email)
          //     ? 'Invalid email'
          //     : undefined
          // }
        />
      </Table.Td>
      <Table.Td>
        <CloseButton variant="outline" onClick={() => removeDelegateRow(idx)} />
      </Table.Td>
    </Table.Tr>
  ));

  const ownerRow = () => (
    <Table.Tr key="owner-row">
      <Table.Td>{auth.currentUser?.email ?? 'You'} (you)</Table.Td>
      <Table.Td>
        <Select
          data={ROLE_OPTIONS}
          value={ownerRole}
          allowDeselect={false}
          onChange={(val) => {
            // Mantine types this as string | null
            if (val) setOwnerRole(val as RoleOption);
          }}
          placeholder="Select your role"
        />
      </Table.Td>
    </Table.Tr>
  );

  const staffRows = form.values.staff.map(({ email, role }, idx) => (
    <Table.Tr key={`${email}-${idx}`}>
      <Table.Td>{email}</Table.Td>
      <Table.Td>
        <Select
          data={['director', 'assistant director', 'flex staff']}
          placeholder="Add staff role here..."
          value={role}
          allowDeselect={false}
          onChange={(role) => {
            const list = [...form.values.staff];
            list[idx].role = (role as Staff['role']) || 'flex staff'; // default to 'flex staff' if role is null
            form.setFieldValue('staff', list);
          }}
        />
      </Table.Td>
      <Table.Td>
        <CloseButton variant="outline" onClick={() => removeStaffRow(idx)} />
      </Table.Td>
    </Table.Tr>
  ));

  const setAndSort = (newDelegates: Delegate[]) => {
    form.setFieldValue(
      'delegates',
      [...form.values.delegates, ...newDelegates].sort((a, b) =>
        a.country.name.localeCompare(b.country.name),
      ),
    );

    closeDelegateModal();
  };

  const addCustomRows = () => {
    const selectedCustomDelegates = [customValues].map((country) => ({
      country: country as unknown as Country,
      email: '',
    }));

    setAndSort(selectedCustomDelegates);

    setAvailableCountries((prev) =>
      prev.filter((c) => !selectedCustomDelegates.some((d) => d.country === c)),
    );
    setCustomValues('');
  };

  const addUNRows = () => {
    const selectedUNDelegates = selectedValues.map((country) => ({
      country: country as unknown as Country,
      email: '',
    }));
    setAndSort(selectedUNDelegates);

    setAvailableCountries((prev) => prev.filter((c) => !selectedValues.includes(c.name)));

    setSelectedValues([]);
  };

  const addImportedRows = () => {
    // if (!importedValues.length || !countryCol || !delegateCol) {
    //   console.warn('Missing imported values or column mapping.');
    //   return;
    // }

    if (!importedValues.length) {
      console.warn('No new delegates to add.');
      return;
    }

    setAndSort(importedValues as Delegate[]);

    setAvailableCountries((prev) =>
      prev.filter((c) => !importedValues.some((d) => d.country === c)),
    );

    setImportedValues([]);
  };

  const removeDelegateRow = (idx: number) => {
    const removed = form.values.delegates[idx];
    form.setFieldValue(
      'delegates',
      form.values.delegates.filter((_, i) => i !== idx),
    );
    if (un_countries.map((c: { value: unknown }) => c.value).includes(removed.country)) {
      const countryObj = un_countries.find(
        (c: { value: Country }) => c.value === removed.country,
      );
      if (countryObj) {
        setAvailableCountries((prev) => [...prev, countryObj]);
      }
    }
  };

  const addStaffRows = () => {
    const staffEmails: Staff[] = staffValues.map((email) => ({
      role: 'flex staff', // default role, can be changed later
      email,
    }));

    form.setFieldValue('staff', [...form.values.staff, ...staffEmails]);
    console.log('Added staff rows:', form.values.staff);
    setStaffValues([]);
    closeStaffModal();
  };
  
  const removeStaffRow = (idx: number) => {
    form.setFieldValue(
      'staff',
      form.values.staff.filter((_, i) => i !== idx),
    );
  };

  // State for stepper
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));

  return (
    <Container size="md" p="xl" h={'100vh'}>
      <Modal
        opened={openedStaffModal}
        onClose={() => {
          setStaffValues([]);
          closeStaffModal();
        }}
        title="Who’s on your staff team?"
        size="md"
        centered
      >
        <StaffModalContent
          onTagChange={setStaffValues}
          onSubmit={() => {
            addStaffRows();
          }}
        />
      </Modal>
      <Modal
        opened={openedDelegateModal}
        onClose={() => {
          setSelectedValues([]);
          setCustomValues('');
          setImportedValues([]);
          // setUploadedUrl(null);
          closeDelegateModal();
        }}
        title={
          activeModal === 'UN'
            ? 'Add UN countries'
            : activeModal === 'custom'
              ? 'Add custom country'
              : 'Import Spreadsheet'
        }
        size={'lg'}
        centered
      >
        {activeModal === 'UN' && (
          <UNModalContent
            availableCountries={availableCountries}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            addUNRows={addUNRows}
            closeDelegateModal={closeDelegateModal}/>
        )}

        {activeModal === 'custom' && (
          <CustomModalContent
            availableCountries={availableCountries}
            customValues={customValues}
            setCustomValues={setCustomValues}
            addCustomRows={addCustomRows}
            closeDelegateModal={closeDelegateModal}/>
        )}

        {activeModal === 'import' && (
          <ImportSheetContent
            onPaste={handlePaste}
            onSubmit={addImportedRows}
          />
        )}
      </Modal>

      <Flex direction="column" gap="md" h="100%" w="100%" py="xl">
        <Box component="form" onSubmit={handleSubmit}>
          <Stack flex={1} justify="flex-start" align="center">
            <Stepper
              active={active}
              onStepClick={setActive}
              allowNextStepsSelect={false}
              w={'100%'}
              h={'100%'}
            >
              <Stepper.Step label="First step" description="Basic Information" h={'100%'}>
                <StepOne form={form} />
              </Stepper.Step>
              <Stepper.Step label="Second step" description="Add Staff Members">
                <StepTwo
                  ownerRow={ownerRow}
                  staffRows={staffRows}
                  openStaffModal={openStaffModal}
                />
              </Stepper.Step>
              <Stepper.Step label="Final step" description="Add Countries + Delegates">
                <StepThree
                  form={form}
                  delegateRows={delegateRows}
                  openDelegateModal={openDelegateModal}
                  setActiveModal={setActiveModal}
                />
              </Stepper.Step>
              <Stepper.Completed>
                Completed, click back button to get to previous step
              </Stepper.Completed>
            </Stepper>
          </Stack>
        </Box>

        <Flex flex={1} justify="flex-end" align="flex-end" py={'md'}>
          {loading ? (
            <Loader size="sm" />
          ) : active === 2 ? (
            <>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={
                  !form.isValid() ||
                  !form.values.committeeLongName.trim() ||
                  !form.values.committeeShortName.trim() ||
                  !form.values.dateRange[0] ||
                  !form.values.dateRange[1] ||
                  hasInvalidDelegateEmail
                }
              >
                Complete
              </Button>
              {hasInvalidDelegateEmail}
            </>
          ) : (
            <Button
              type="submit"
              rightSection={<IconArrowRight size={18} stroke={1.5} />}
              onClick={nextStep}
              // disabled={
              //   !form.isValid() ||
              //   !form.values.committeeLongName.trim() ||
              //   !form.values.committeeShortName.trim() ||
              //   !form.values.dateRange[0] ||
              //   !form.values.dateRange[1]
              // }
            >
              Next step
            </Button>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};
