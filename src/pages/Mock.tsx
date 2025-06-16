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
  // State for modal
  const [opened, { open, close }] = useDisclosure(false);

  // State for selected values in MultiSelect
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [tableValues, setTableValues] = useState<string[]>([]);

  // State for stepper
  const [active, setActive] = useState(1);
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
  const [date, setDate] = useState<Date | null>(null);
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

  const removeCountry = (countryToRemove: string) => {
    setTableValues((prev) => prev.filter((country) => country !== countryToRemove));
  };

  const rows = tableValues.map((country) => (
    <Table.Tr key={country}>
      <Table.Td>{country}</Table.Td>
      <Table.Td>
        <TextInput placeholder="Add delegate email here..." />
      </Table.Td>
      <Table.Td>
        <CloseButton variant="outline" onClick={() => removeCountry(country)} />
      </Table.Td>
    </Table.Tr>
  ));

  // const [rows, setRows] = useState([]);

  // const addRow = () => {
  //     const newRow = { name: 'John Doe', age: 30 }; // Replace with your data
  //     setRows([...rows, newRow]);
  // }

  return (
    <Container size="md" p='xl' h={'100vh'}>
       <Modal opened={opened} onClose={close} title="Add a country" centered>
        <Stack gap={'md'}>
          <MultiSelect
            label="Add UN countries"
            placeholder="Type to search..."
            data={[
              'Canada',
              'United States',
              'Mexico',
              'United Kingdom',
              'Germany',
              'France',
              'Japan',
              'Australia',
              'India',
              'China',
            ]}
            value={selectedValues}
            onChange={setSelectedValues}
            clearable
            searchable
            nothingFoundMessage="Nothing found..."
          />
          <TagsInput
            label="Add custom countries"
            clearable
            placeholder="Type a country name and press enter..." // this is kinda wordy lmao but alas
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
              onClick={() => {
                close();
                setTableValues((prev) => [...prev, ...selectedValues]); // Add selected values to table
              }}
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
                    <Container size="500px" p="md">
                    <Flex p='xl' direction='column' gap={'md'}>
                            <TextInput
                                label="What’s your committee name?"
                                placeholder="e.g. the bestest committee :D"
                                {...form.getInputProps('committeeName')}
                                radius="lg"
                                required
                            />
                            <DateInput
                                // minDate={dayjs().format('YYYY-MM-DD')}
                                label="When does your event start?"
                                placeholder="Pick a start date"
                                value={date}
                                onChange={setDate}
                                radius="lg"
                            />

                            <DateInput
                                // minDate={dayjs().format('YYYY-MM-DD')}
                                label="When does your event end?"
                                placeholder="Pick a end date"
                                value={date}
                                onChange={setDate}
                                radius="lg"
                            />
                    </Flex>
                    </Container>
                </Stepper.Step>
                <Stepper.Step label="Second step" description="Add Staff Members">
                    <Container size="500px" p="md">
                        <TagsInput
                            label="Who’s on your staff team?"
                            placeholder="Press enter to add a staff email..."
                            leftSection={<IconAt size={16} />}
                            radius="lg"
                        />
                    </Container> 
                </Stepper.Step>
                <Stepper.Step label="Final step" description="Add Countries + Delegates">
                    <Container size="800px" p="md">
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
                            <ActionIcon variant="filled" aria-label="Add country" onClick={open}>
                                <IconPlus style={{ width: '70%', height: '70%' }} stroke={2}/>
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
