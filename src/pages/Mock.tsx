import { ReactElement, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
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
  FileInput,
  Image,
  Select,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconArrowRight,
  IconAt,
  IconCalendar,
  IconFileSpreadsheet,
  IconPhoto,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableButton, ImageUploader } from './Components';
import {
  createCommittee,
  addStaffToCommittee,
  addDelegateToCommittee,
  addUserCommittee,
  createStaff,
  createDelegate,
  getOrCreateUidFromEmail,
} from './yeahglo';
import {
  generateCommitteeId,
  generateDelegateId,
  generateStaffId,
} from '@packages/generateIds';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { firestoreDb } from '@packages/firebase/firestoreDb';

type Delegate = { country: string; email: string };

export const Mock = (): ReactElement => {
  const form = useForm({
    initialValues: {
      committeeLongName: '',
      committeeShortName: '',
      staff: [] as string[],
      delegates: [] as Delegate[],
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      committeeLongName: (v) => (v.trim() ? null : 'Required'),
      committeeShortName: (v) => (v.trim() ? null : 'Required'),
    },
  });

    async function ultimateConsoleLog(): Promise<void> {
    console.log('--- DATABASE DUMP START ---');

    // 1) Committees + their staff and delegate subcollections
    const committeesSnap = await getDocs(collection(firestoreDb, 'committees'));
    console.log(`Found ${committeesSnap.size} committees.`);
    for (const cDoc of committeesSnap.docs) {
      console.log(`Committee [${cDoc.id}]:`, cDoc.data());

      const staffSnap = await getDocs(collection(firestoreDb, 'committees', cDoc.id, 'staff'));
      console.log(`  ↳ staff (${staffSnap.size}):`);
      staffSnap.docs.forEach(s => console.log(`    • [${s.id}]`, s.data()));

      const delSnap = await getDocs(collection(firestoreDb, 'committees', cDoc.id, 'delegates'));
      console.log(`  ↳ delegates (${delSnap.size}):`);
      delSnap.docs.forEach(d => console.log(`    • [${d.id}]`, d.data()));
    }

    // 2) Users + their committees
    const usersSnap = await getDocs(collection(firestoreDb, 'users'));
    console.log(`Found ${usersSnap.size} users.`);
    for (const uDoc of usersSnap.docs) {
      console.log(`User [${uDoc.id}]:`, uDoc.data());

      const ucSnap = await getDocs(collection(firestoreDb, 'users', uDoc.id, 'committees'));
      console.log(`  ↳ user‑committees (${ucSnap.size}):`);
      ucSnap.docs.forEach(uc => console.log(`    • [${uc.id}]`, uc.data()));
    }

    // 3) Root staff collection
    const rootStaffSnap = await getDocs(collection(firestoreDb, 'staff'));
    console.log(`Found ${rootStaffSnap.size} staff records at root.`);
    rootStaffSnap.docs.forEach(s => console.log(`  • [${s.id}]`, s.data()));

    // 4) Root delegates collection
    const rootDelSnap = await getDocs(collection(firestoreDb, 'delegates'));
    console.log(`Found ${rootDelSnap.size} delegate records at root.`);
    rootDelSnap.docs.forEach(d => console.log(`  • [${d.id}]`, d.data()));

    console.log('--- DATABASE DUMP END ---');
  }

  const handleSubmit = async () => {
    try {
      // committee
      const committeeId = generateCommitteeId(form.values.committeeShortName.trim());
      const [startDate, endDate] = form.values.dateRange;
      await createCommittee(committeeId, form.values.committeeLongName, form.values.committeeShortName, startDate!, endDate!);

      // staff
      const staffTasks = form.values.staff.map(async (email) => {
        const uid = await getOrCreateUidFromEmail(email);
        console.log(`Using user ${uid} for staff email ${email}.`);

        const staffId = generateStaffId();
        await createStaff(staffId, uid);
        await addStaffToCommittee(committeeId, staffId, false);
        await addUserCommittee(uid, committeeId, 'staff');
      });

      // delegates
      const delegateTasks = form.values.delegates.map(async ({ country, email }) => {
        const uid = await getOrCreateUidFromEmail(email);
        console.log(`Using user ${uid} for delegate email ${email}.`);

        const delegateId = generateDelegateId(country);
        await createDelegate(delegateId, uid);
        await addDelegateToCommittee(committeeId, delegateId, country);
        await addUserCommittee(uid, committeeId, 'delegate');
      });

      await Promise.all([...staffTasks, ...delegateTasks]);
      await ultimateConsoleLog();
      form.reset();
      console.log('Form reset; flow complete.');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    }
  };

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
  const [opened, { open, close: close }] = useDisclosure(false);
  const [activeModal, setActiveModal] = useState<'UN' | 'custom' | 'import' | null>(null);  

  // State for UN countries
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // State for custom countries
  const [customValues, setCustomValues] = useState<string[]>([]);

  // State for imported countries
  const [importedValues, setImportedValues] = useState<any[]>([]);
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([]);
  const [countryCol, setCountryCol] = useState<string | null>(null);
  const [delegateCol, setDelegateCol] = useState<string | null>(null);

  // State for available countries
  const [availableCountries, setAvailableCountries] = useState<string[]>(un_countries);

  const existingCountries = new Set(form.values.delegates.map((d) => d.country));

  // State for flag things
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  
  // const handleImage = async () => {
  //   if (!flag) return;
  //   setLoading(true);
  //   try {
  //     const url = await uploadImageToCloudinary(flag);
  //     setImageUrl(url);
  //     console.log('image url:', imageUrl);

  //   } catch (err) {
  //     console.error('Upload error', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // !TEST !TEST! TEST! these r for testing
  useEffect(() => {
    console.log('Imported delegates updated:', importedValues);
  }, [importedValues]);
  useEffect(() => {
    console.log('Imported headers updated:', sheetHeaders);
  }, [sheetHeaders]);
    useEffect(() => {
    console.log('selected values updated:', selectedValues);
  }, [selectedValues]);
    useEffect(() => {
    console.log('custom values updated:', customValues);
  }, [customValues]);

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
        <CloseButton variant="outline" onClick={() => removeRow(idx)} />
      </Table.Td>
    </Table.Tr>
  ));

  const setAndSort = (newDelegates: Delegate[]) => {
    form.setFieldValue(
      'delegates',
      [...form.values.delegates, ...newDelegates].sort((a, b) =>
        a.country.localeCompare(b.country),
      ),
    );

    close();
  };

  const addImportedRows = () => {
    const importedDelegates = saveImported(importedValues);
    setAndSort(importedDelegates);

    setAvailableCountries((prev) =>
      prev.filter((c) => !importedDelegates.some((d) => d.country === c)),
    );
    setImportedValues([]);
    setSheetHeaders([]);
    setCountryCol(null);
    setDelegateCol(null);
  };

  const addCustomRows = () => {
    const selectedCustomDelegates = customValues.map((country) => ({
      country,
      email: '',
    }));

    // handleImage();

    setAndSort(selectedCustomDelegates);

    setAvailableCountries((prev) =>
      prev.filter((c) => !selectedCustomDelegates.some((d) => d.country === c)),
    );
    setCustomValues([]);
  };

  const addUNRows = () => {
    const selectedUNDelegates = selectedValues.map((country) => ({
      country,
      email: '',
    }));
    setAndSort(selectedUNDelegates);

    setAvailableCountries((prev) => prev.filter((c) => !selectedValues.includes(c)));
    setSelectedValues([]);
  };

  const addRows = () => {
    addUNRows();
    addCustomRows();
    addImportedRows();
  };

  const removeRow = (idx: number) => {
    const removed = form.values.delegates[idx];
    form.setFieldValue(
      'delegates',
      form.values.delegates.filter((_, i) => i !== idx),
    );
    setAvailableCountries((prev) => [...prev, removed.country]);
  };

  async function readImported(payload: File | null) {
    if (!payload) {
      setImportedValues([]);
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { raw: true, defval: '' });

        if (!json.length) return;

        const headers = Object.keys(json[0] as object);
        setSheetHeaders(headers);

        if (headers.includes('Country')) setCountryCol('Country');
        if (headers.includes('Delegate')) setDelegateCol('Delegate');

        setImportedValues(json as { Country: string; Delegate: string }[]);
      };
      reader.readAsArrayBuffer(payload);
    } catch (error) {
      console.error('Failed to import file:', error);
    }
  }

  // Update available countries when delegates change; existingCountries changes on every render i think so this does not work. lol
  // useEffect(() => {
  //   setAvailableCountries(un_countries)
  //   setAvailableCountries((prev) =>
  //     prev.filter((c) => !existingCountries.has(c)),
  //   );
  // }, [existingCountries, un_countries]);

  function saveImported(
    jsonData: Record<string, unknown>[],
  ): { country: string; email: string }[] {
    if (!Array.isArray(jsonData)) return [];
    console.log('ahaha:', jsonData);

    const mapped = jsonData
      .map((row) => {
        const country =
          countryCol && typeof row[countryCol] === 'string' ? row[countryCol].trim() : '';
        const email =
          delegateCol && typeof row[delegateCol] === 'string'
            ? row[delegateCol].trim()
            : '';
        return { country, email };
      })

      .filter((d) => !existingCountries.has(d.country));

    console.log('Mapped delegates:', mapped);

    if (mapped.length) {
      // Remove imported countries from availableCountries if they are in the UN list
      setAvailableCountries((prev) =>
        prev.filter((c) => !mapped.some((d) => d.country === c)),
      );
      return mapped;
    } else {
      console.warn('No new delegates to add, all are already present.');
      return [];
    }
  }

  // State for stepper
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));

  return (
    <Container size="md" p="xl" h={'100vh'}>
      <Modal  
      opened={opened}
      onClose={() => {
        setSelectedValues([]);
        setCustomValues([]);
        setImportedValues([]);
        setUploadedUrl(null)
        close();
      }} 
      title={activeModal === 'UN'
            ? 'Add UN countries'
            : activeModal === 'custom'
            ? 'Add custom country'
            : 'Import Spreadsheet'} 
      centered>

          {activeModal === 'UN' && (
            <Stack>
<           MultiSelect
            label="Add UN countries"
            placeholder="Type to search..."
            data={availableCountries.sort()}
            value={selectedValues}
            onChange={setSelectedValues}
            clearable
            searchable
            nothingFoundMessage="Nothing found..."
          />
          <Group justify="center">
            <Button onClick={addUNRows}>Submit countries</Button>
          </Group>
            </Stack>
            
        )}

        {activeModal === 'custom' && (
          <Stack>
            <TagsInput
            label="Add custom countries"
            placeholder="Type a country name and press enter..." // this is kinda wordy lmao but alas
            value={customValues}
            onChange={setCustomValues}
            clearable
            />
            {/* <TextInput
            label="Add custom country"
            placeholder="Type a country name"
            /> */}
            <ImageUploader onChange={() => setUploadedUrl(null)} onUploadSuccess={setUploadedUrl} />
            {uploadedUrl && <Image w={'200px'}
            radius="md"
            src={uploadedUrl}
            />}

          <Group justify="center">
            <Button onClick={addCustomRows}>Submit countries</Button>
          </Group>
          </Stack>
        )}

        {activeModal === 'import' && (
          <Stack>
            <div>
          <FileInput
            clearable
            label="Import spreadsheet"
            placeholder="Upload spreadsheet"
            leftSection={<IconFileSpreadsheet size={18} stroke={1.5} />}
            onChange={readImported}
            accept=".xlsx,.xls,.csv"
          />
            {importedValues.length > 0 && (
              <Group grow>
                <Select
                  label="Which column is Country?"
                  data={sheetHeaders}
                  value={countryCol}
                  onChange={setCountryCol}
                  placeholder="Choose column"
                />

                <Select
                  label="Which column is Delegate?"
                  data={sheetHeaders}
                  value={delegateCol}
                  onChange={setDelegateCol}
                  placeholder="Choose column"
                />
              </Group>
            )}
          </div>

            <Group justify="center">
              <Button onClick={addImportedRows}>Submit countries</Button>
            </Group>
          </Stack>
          
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
                <Container size="sm" p="xl">
                  <Flex direction="column" gap={'sm'}>
                    <Title order={3}>1. Basic Information</Title>
                    <Text size="sm">
                      Let us know some general information about your committee and event
                      to get started.
                    </Text>

                    <Space h="md" />

                    <TextInput
                      label="What’s your committee long name?"
                      placeholder="e.g. the bestest committee :D"
                      {...form.getInputProps('committeeLongName')}
                      radius="lg"
                      autoFocus
                      required
                    />

                    <Space h="md" />

                    <TextInput
                      label="What’s your committee short name?"
                      placeholder="e.g. tbc"
                      {...form.getInputProps('committeeShortName')}
                      radius="lg"
                      autoFocus
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
                      starts. All unsaved data will be lost one week after your event
                      ends.
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
                      autoFocus
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
                          <Button onClick={() => {
                          setActiveModal('import')
                          open()
                          }}>Import spreadsheet?</Button>
                          <Button onClick={() => {
                          setActiveModal('UN')
                          open()
                        }}>Add UN countries?</Button>
                        </Group>
                      </Stack>
                    )}

                    <Flex justify="flex-end" flex={1}>
                      <ExpandableButton 
                        onClick= {(open)} 
                        onFirst= {() => {
                          setActiveModal('UN')
                          open()
                        }} 
                        onSecond={() => {
                          setActiveModal('custom')
                          open()
                        }}
                        onThird= {() => {
                          setActiveModal('import')
                          open()
                          }}>
                      </ExpandableButton>
                      {/* <Group w="100%">
                        <Button size="compact-xs" flex={1} onClick={() => {
                          setActiveModal('UN');
                          open();
                        }}>
                          UN countries
                        </Button>
                        
                        <Button size="compact-xs" flex={1} onClick={() => {
                          setActiveModal('custom');
                          open();
                        }}>
                          custom country
                        </Button>
                        
                        <Button size="compact-xs" flex={1} onClick={() => {
                          setActiveModal('import');
                          open();
                        }}>
                          import spreadsheet
                        </Button> 
                      </Group> */}
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

        <Flex flex={1} justify="flex-end" align="flex-end" py={'md'}>
          {active === 2 ? (
            <Button type="submit" onClick={handleSubmit}>
              Complete
            </Button>
          ) : (
            <Button
              type="submit"
              rightSection={<IconArrowRight size={18} stroke={1.5} />}
              onClick={nextStep}
              disabled={!form.isValid() || !form.values.committeeLongName.trim() || !form.values.committeeShortName.trim() || !form.values.dateRange[0] || !form.values.dateRange[1]}
            >
              Next step
            </Button>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};
