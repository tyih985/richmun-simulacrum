import { ReactElement, useState } from 'react';
import '@mantine/dates/styles.css';
import { useForm } from '@mantine/form';
import {
  Container,
  Stack,
  Title,
  Divider,
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
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  createFirestoreDocument,
  getFirestoreDocument,
} from '@packages/firestoreAsQuery';
import { committeePath } from '@packages/firestorePaths';
import { IconAt, IconFileSpreadsheet, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

type TestData = { message: string };

export const Mock = (): ReactElement => {
  const [opened, { open, close }] = useDisclosure(false);
  
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

  const handleSet = async () => {
    setResult(null);
    const name = form.values.committeeName.trim();
    if (!name) {
      setResult('Committee name is required');
      return;
    }
    const path = committeePath(name);
    try {
      await createFirestoreDocument<TestData>(path, { message: name }, true);
      setResult(`Wrote document at "${path}"`);
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
  };

  const handleGet = async () => {
    setResult(null);
    const name = form.values.committeeName.trim();
    if (!name) {
      setResult('Committee name is required');
      return;
    }
    const path = committeePath(name);
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
  
    const country = [
        { name: 'Country A', delegate: 'Delegate 1, Delegate 2' },
        { name: 'Country B', delegate: 'Delegate 3, Delegate 4' },
        // Add more countries and delegates as needed
    ];

    const rows = country.map((country) => (
        <Table.Tr key={country.name}>
        <Table.Td>{country.name}</Table.Td>
        <Table.Td><TextInput placeholder='Add delegate email here...'></TextInput></Table.Td>
        </Table.Tr>
    ));

    // const [rows, setRows] = useState([]);

    // const addRow = () => {
    //     const newRow = { name: 'John Doe', age: 30 }; // Replace with your data
    //     setRows([...rows, newRow]);
    // }

  return (
    <Container size="md" p='xl'>
       
       <Modal opened={opened} onClose={close} title="Add a country" centered>
        <Stack gap={'md'}>
            <MultiSelect
                label="Add UN countries"
                placeholder="Type to search..."
                data={['Canada', 'United States', 'Mexico', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 'India', 'China']}
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
                <FileButton onChange={close/*<- placeholder bc i dont wanna figure it out rn should be smt to setFile*/} accept="">
                {(props) => <Button rightSection={<IconFileSpreadsheet size={18} stroke={1.5}/>} variant='default'{...props}>Import spreadsheet</Button>}
                </FileButton>
            </Group>
            <Group justify="center">
                <Button onClick={close}>Submit countries</Button>
            </Group>
            
        </Stack>
       </Modal>
       
       <Stack gap='md' py={'xl'}>
        <Title>Let’s get set up!</Title>
        <Text size="sm" color="dimmed">
            This will help you create a committee and set up your event.
        </Text>

        <Container size="300px" m={0}>
          <TextInput
            label="What’s your committee name?"
            placeholder="e.g. the bestest committee :D"
            {...form.getInputProps('committeeName')}
            radius="lg"
            required
          />

          <Space h="md"></Space>
          <DateInput
            label="When does your event start?"
            placeholder="Pick a date"
            value={date}
            onChange={setDate}
            radius="lg"
          />
        </Container>

        <Fieldset legend="Staff">
          <TagsInput
            label="Who’s on your staff team?"
            placeholder="Press enter to add a staff email..."
            leftSection={<IconAt size={16} />}
            radius="lg"
          />
        </Fieldset>

        <Fieldset legend="Delegation">
          <Table stickyHeader highlightOnHover withColumnBorders>
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
               
        </Fieldset>

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
      </Stack>
    </Container>
  );
};