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
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  createFirestoreDocument,
  getFirestoreDocument,
} from '@packages/firestoreAsQuery';
import { committeePath } from '@packages/firestorePaths';
import {
  IconArrowLeft,
  IconArrowRight,
  IconAt,
  IconFileSpreadsheet,
  IconPlus,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { generateCommitteeId } from '@packages/generateIds';

type TestData = { message: string };

export const Mock = (): ReactElement => {

  const un_countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  // State for modal
  const [opened, { open, close }] = useDisclosure(false);

  // State for UN countries
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // State for custom countries 
  const [customValues, setCustomValues] = useState<string[]>([]);

  // State for table data
  const [tableValues, setTableValues] = useState<string[]>([]);

  // State for available countries
  const [availableCountries, setAvailableCountries] = useState<string[]>(un_countries);

  const rows = tableValues.map((country) => (
    <Table.Tr key={country}>
      <Table.Td>{country}</Table.Td>
      <Table.Td>
        <TextInput placeholder="Add delegate email here..." />
      </Table.Td>
      <Table.Td>
        <CloseButton variant="outline" onClick={() => removeRow(country)} />
      </Table.Td>
    </Table.Tr>
  ));
  
  const removeRow = (countryToRemove: string) => {
    setTableValues((prev) => prev.filter((country) => country !== countryToRemove));

    // Add to available countries
    setAvailableCountries((prev) => [...prev, countryToRemove]);
  };

  const addRows = () => {
    setTableValues((prev) => [...prev, ...selectedValues]);
            
    // Remove from available countries
    setAvailableCountries((prev) =>
    prev.filter((country) => !selectedValues.includes(country))
    );

    setSelectedValues([]);
    close();
  };

  // State for stepper
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm({
    initialValues: {
      committeeName: '',
    },
    validate: {
      committeeName: (v) => (v.trim() ? null : 'Required'),
    },
  });

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

  const handleSet = async () => {
    setResult(null);
    if (!generatedId) {
      setResult('Valid committee name is required');
      return;
    }

    const path = committeePath(generatedId);
    try {
      await createFirestoreDocument<TestData>(
        path,
        { message: form.values.committeeName },
        true,
      );
      setResult(`Wrote document at "${path}"`);
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
  };

  const handleGet = async () => {
    setResult(null);
    if (!generatedId) {
      setResult('Valid committee name is required');
      return;
    }

    const path = committeePath(generatedId);
    try {
      const data = await getFirestoreDocument<TestData>(path);
      if (data) {
        setResult(`Fetched: ${JSON.stringify(data)}`);
      } else {
        setResult(`No document at "${path}"`);
      }
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
  };

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

  

  return (
    <Container size="md" p='xl' h={'100vh'}>
       <Modal opened={opened} onClose={close} title="Add a country" centered>
        <Stack p={'lg'} pt='sm' gap={'md'}>
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
            <FileButton
              onChange={
                close /*<- placeholder bc i dont wanna figure it out rn should be smt to setFile*/
              }
              accept=""
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
            <Button
              onClick={addRows}
            >
              Submit countries
            </Button>
          </Group>
        </Stack>
       </Modal>

        {/* <Title>Let’s get set up!</Title>
        <Text size="sm" c="dimmed">
            This will help you create a committee and set up your event.
        </Text> */}
        <Flex direction="column" gap="md" h="100%" w='100%' py="xl">
            <Stack flex={1} justify='flex-start' align='center'>
            <Stepper active={active} onStepClick={setActive}  w={'100%'}>
                <Stepper.Step label="First step" description="Basic Information">
                    <Container size="500px" p="xl">
                    <Flex direction='column' gap={'md'}>
                            <TextInput
                                label="What’s your committee name?"
                                placeholder="e.g. the bestest committee :D"
                                {...form.getInputProps('committeeName')}
                                radius="lg"
                                required
                            />
                            <DateInput
                                minDate={dayjs().toDate()}
                                label="When does your event start?"
                                placeholder="Pick a start date"
                                value={startDate}
                                onChange={setStartDate}
                                radius="lg"
                            />

                            <DateInput
                                minDate={startDate || undefined}
                                label="When does your event end?"
                                placeholder="Pick a end date"
                                value={endDate}
                                onChange={setEndDate}
                                radius="lg"
                            />
                    </Flex>
                    </Container>
                </Stepper.Step>
                <Stepper.Step label="Second step" description="Add Staff Members">
                    <Container size="500px" p="xl">
                        <TagsInput
                            label="Who’s on your staff team?"
                            placeholder="Press enter to add a staff email..."
                            leftSection={<IconAt size={16} />}
                            radius="lg"
                        />
                    </Container> 
                </Stepper.Step>
                <Stepper.Step label="Final step" description="Add Countries + Delegates">
                    <Container size="800px" p="xl">
                        <Table stickyHeader highlightOnHover >
                            <Table.Thead>
                                <Table.Tr>
                                <Table.Th>Country</Table.Th>
                                <Table.Th>Delegate</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                   
                    
                        {rows.length === 0 && (
                            <Stack align='center' justify='center' bg="gray.0" p="md">
                                <Text c="dimmed">no countries added :c</Text>
                                <Group>
                                <Button>Import spreadsheet?</Button>
                                <Button>Add UN countries?</Button>
                                </Group>
                            </Stack>
                        )}

                        <Flex justify="flex-end" mt="md">
                            <ActionIcon variant="outline" aria-label="Add country" onClick={open}>
                                <IconPlus style={{ width: '70%', height: '70%' }} stroke={3}/>
                            </ActionIcon>
                        </Flex>
                     </Container>
                </Stepper.Step>
                <Stepper.Completed>
                Completed, click back button to get to previous step
                </Stepper.Completed>
            </Stepper>
            </Stack>

            {/* temp stuff */}
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
            )}

            <Flex justify="center" align='flex-end'p={'xl'} gap={"sm"}>
                <Button variant="default" leftSection={<IconArrowLeft size={18} stroke={1.5}/>} onClick={prevStep}>Back</Button>
                <Button rightSection={<IconArrowRight size={18} stroke={1.5}/>} onClick={nextStep}>Next step</Button>
            </Flex>
        </Flex>
    </Container>
  );
};
