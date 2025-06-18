import { ReactElement, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import '@mantine/dates/styles.css';
import { useForm } from '@mantine/form';
import {
  Container,
  Stack,
  Title,
  TextInput,
  Button,
  Fieldset,
  Table,
  Text,
  Flex,
  TagsInput,
  Space,
  Center,
  Group,
  ActionIcon,
  Modal,
  MultiSelect,
  FileButton,
  Stepper,
  CloseButton,
  AppShell,
  Box,
} from '@mantine/core';
import {
  createCommittee,
  getCommittee,
  createUser,
  getUser,
  addStaffToCommittee,
  addDelegateToCommittee,
  addUserCommittee,
  getUserCommittees,
  createEmail,
  getEmail,
} from './yeahglo';

import { DateInput, DatePickerInput } from '@mantine/dates';
import {
  createFirestoreDocument,
  getFirestoreDocument,
} from '@packages/firestoreAsQuery';
import { committeePath } from '@packages/firestorePaths';
import {
  IconArrowLeft,
  IconArrowRight,
  IconAt,
  IconCalendar,
  IconFileSpreadsheet,
  IconPlus,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { generateCommitteeId } from '@packages/generateIds';

type Delegate = { country: string; email: string };

export const Mock = (): ReactElement => {
  const form = useForm({
    initialValues: {
      committeeName: '',
      staff: [] as string[],
      delegates: [] as Delegate[],
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      committeeName: (v) => (v.trim() ? null : 'Required'),
    },
  });

  const handleSubmit = async () => {
    console.log('submitting form', form.values);

    const [startDate, endDate] = form.values.dateRange;
    if (!startDate || !endDate) {
      console.error('Start date and end date are required.');
      return;
    }

    try {
      await createCommittee(
        generateCommitteeId(form.values.committeeName),
        form.values.committeeName,
        startDate,
        endDate
      );
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  const un_countries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo (Congo-Brazzaville)',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Democratic Republic of the Congo',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Korea',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe',
  ];

  // State for modal
  const [opened, { open, close }] = useDisclosure(false);

  // State for UN countries
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // State for custom countries
  const [customValues, setCustomValues] = useState<string[]>([]);

  // State for available countries
  const [availableCountries, setAvailableCountries] = useState<string[]>(un_countries);

  const rows = form.values.delegates.map(({ country, email }, idx) => (
    <Table.Tr key={`${country}-${idx}`}>
      <Table.Td>{country}</Table.Td>
      <Table.Td>
        <TextInput
          placeholder="Add delegate email here..."
          value={email}
          onChange={(e) => {
            const list = [...form.values.delegates];
            list[idx].email = e.currentTarget.value;
            form.setFieldValue('delegates', list);
          }}
        />
      </Table.Td>
      <Table.Td>
        <CloseButton variant="outline" onClick={() => removeDelegate(idx)} />
      </Table.Td>
    </Table.Tr>
  ));

  const removeDelegate = (idx: number) => {
    const removed = form.values.delegates[idx];
    form.setFieldValue(
      'delegates',
      form.values.delegates.filter((_, i) => i !== idx),
    );
    setAvailableCountries((prev) => [...prev, removed.country]);
  };

const addRows = () => {
  const selectedUNDelegates = selectedValues.sort().map((country) => ({
    country,
    email: '',
  }));
  const selectedCustomDelegates = customValues.sort().map((country) => ({
    country,
    email: '',
  }));
  form.setFieldValue('delegates', [
    ...form.values.delegates,
    ...selectedUNDelegates,
    ...selectedCustomDelegates,
  ]);

   setAvailableCountries((prev) =>
    prev.filter((c) => !selectedValues.includes(c))
  );
  setSelectedValues([]);
  setCustomValues([]);
  close();
};


  // State for stepper
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));

  const [result, setResult] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  // Regenerate ID only when committeeName changes
  useEffect(() => {
    const name = form.values.committeeName.trim();
    if (name) {
      setGeneratedId(generateCommitteeId(name));
    } else {
      setGeneratedId(null);
    }
  }, [form.values.committeeName]);

  async function handleFile(payload: File | null): Promise<void> {
    if (!payload) return;
  }

  return (
    <Container size="md" p="xl" h={'100vh'}>
      <Modal opened={opened} onClose={close} title="Add a country" centered>
        <Stack p={'lg'} pt="sm" gap={'md'}>
          <MultiSelect
            label="Add UN countries"
            placeholder="Type to search..."
            data={availableCountries.sort()}
            value={selectedValues}
            onChange={setSelectedValues}
            clearable
            searchable
            nothingFoundMessage="Nothing found..."
          />
          <TagsInput
            label="Add custom countries"
            placeholder="Type a country name and press enter..." // this is kinda wordy lmao but alas
            value={customValues}
            onChange={setCustomValues}
            clearable
          />
          <Group justify="flex-start">
            <FileButton onChange={handleFile} accept=".xlsx, .xls, .csv"
            >
              {(props) => (
                <Button
                  rightSection={<IconFileSpreadsheet size={18} stroke={1.5} />}
                  variant="default"
                  {...props}
                >
                  Import spreadsheet
                </Button>
              )}
            </FileButton>
          </Group>
          <Group justify="center">
            <Button onClick={addRows}>Submit countries</Button>
          </Group>
        </Stack>
      </Modal>

      <Flex direction="column" gap="md" h="100%" w="100%" py="xl">
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <Stack flex={1} justify="flex-start" align="center">
          <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false} w={'100%'} h={'100%'}>
            <Stepper.Step label="First step" description="Basic Information" h={'100%'}>
              <Container size="sm" p="xl">
                <Flex direction="column" gap={'sm'}>
                  <Title order={3}>1. Basic Information</Title>
                  <Text size="sm">
                    Let us know some general information about your committee and event to
                    get started.
                  </Text>

                  <Space h="md" />

                  <TextInput
                    label="What’s your committee name?"
                    placeholder="e.g. the bestest committee :D"
                    {...form.getInputProps('committeeName')}
                    radius="lg"
                    required
                  />

                  <Space h="md" />

                  <DatePickerInput
                    type="range"
                    minDate={dayjs().toDate()}
                    label="What date(s) will your event take place?"
                    placeholder="Pick a date range"
                    value={form.values.dateRange}
                    onChange={(range) => form.setFieldValue('dateRange', range!)}
                    radius="lg"
                    leftSection={<IconCalendar size={20} />}
                    required
                  />

                  <Text size="sm" c="dimmed">
                    Delegates added to the committee will gain access the day your event
                    starts. All unsaved data will be lost one week after your event ends.
                  </Text>
                </Flex>
              </Container>
            </Stepper.Step>
            <Stepper.Step label="Second step" description="Add Staff Members">
              <Container size="sm" p="xl">
                <Flex direction="column" gap={'sm'}>
                  <Title order={3}>2. Add Staff Members</Title>
                  <Text size="sm">
                    Add the emails of staff members who will be managing your committee.
                    They will have access to staff things (?) in the committee and can
                    help manage delegates.
                  </Text>

                  <Space h="md" />

                  <TagsInput
                    label="Who’s on your staff team?"
                    placeholder="Press enter to add a staff email..."
                    leftSection={<IconAt size={16} />}
                    radius="lg"
                    value={form.values.staff}
                    onChange={(list) => form.setFieldValue('staff', list)}
                  />
                  <Text size="sm" c="dimmed">
                    Unsure? No worries, you can change this anytime after you've created
                    your committee.
                  </Text>
                </Flex>
              </Container>
            </Stepper.Step>
            <Stepper.Step label="Final step" description="Add Countries + Delegates">
              <Container size="sm" p="xl">
                <Flex direction="column" gap={'sm'}>
                  <Title order={3}>3. Add Countries + Delegates</Title>
                  <Text size="sm">
                    Add the countries and delegates that will be participating in your
                    committee. This can be done later too!
                  </Text>

                  <Space h="md" />

                  <Table stickyHeader highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Country</Table.Th>
                        <Table.Th>Delegate</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                  </Table>

                  {rows.length === 0 && (
                    <Stack align="center" justify="center" bg="gray.0" p="md">
                      <Text c="dimmed">no countries added :c</Text>
                      <Group>
                        <Button>Import spreadsheet?</Button>
                        <Button>Add UN countries?</Button>
                      </Group>
                    </Stack>
                  )}

                  <Flex justify="flex-end" mt="md">
                    <ActionIcon variant="outline" aria-label="Add country" onClick={open}>
                      <IconPlus style={{ width: '70%', height: '70%' }} stroke={3} />
                    </ActionIcon>
                  </Flex>
                </Flex>
              </Container>
            </Stepper.Step>
            <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed>
          </Stepper>
        </Stack>
        </Box>
        {/* temp stuff
        <Flex justify="flex-end" gap="sm">
          <Button variant="outline" onClick={handleGet} radius="lg">
            Get
          </Button>
          <Button onClick={handleSet} radius="lg">
            Set
          </Button>
        </Flex>

        {result && (
          <Text size="sm" mt="md">
            {result}
          </Text>
        )} */}

        <Flex flex={1} justify="flex-end" align="flex-end" py={'md'}>
          {
            active === 2 ? (
              <Button
                type='submit'
                onClick={handleSubmit}
              >
                Complete
              </Button>
            ) : (
              <Button
                type='submit'
                rightSection={<IconArrowRight size={18} stroke={1.5} />}
                onClick={nextStep}
                disabled={!form.isValid() || !form.values.committeeName.trim() || !form.values.dateRange[0] || !form.values.dateRange[1]}
              >
              Next step
            </Button>
            )
          }
        </Flex>

      </Flex>
    </Container>
  );
};
