import { ReactElement, useState } from 'react';
import { useForm } from '@mantine/form';
import { Stack, Title, TextInput, Button, Text, Fieldset, Container, Table, Flex } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  createFirestoreDocument,
  getFirestoreDocument,
} from '@packages/firestoreAsQuery';
import { committeePath } from '@packages/firestorePaths';
import { generateCommitteeId } from '@packages/generateIds';

type TestData = { message: string };

export const Mock = (): ReactElement => {
  const form = useForm({
    initialValues: {
      shortName: '',
      committeeId: '',
    },
    validate: {
      shortName: (v) => (v.trim() ? null : 'Required'),
    },
  });

  const [result, setResult] = useState<string | null>(null);

  const getDocPath = () => committeePath(form.values.committeeId);

  const handleGenerateCommitteeId = () => {
    const { shortName } = form.values;
    if (!shortName.trim()) {
      setResult('Enter a short name first dummy');
      return;
    }
    const newCommId = generateCommitteeId(shortName.trim());
    form.setFieldValue('committeeId', newCommId);
    setResult(`Generated Committee ID: ${newCommId}`);
  };

  const handleSet = async (values: typeof form.values) => {
    setResult(null);
    const { committeeId } = values;
    if (!committeeId) {
      setResult('Committee ID is required');
      return;
    }

    const docPath = getDocPath();
    try {
      await createFirestoreDocument<TestData>(
        docPath,
        { message: `Committee record for ${committeeId}` },
        true
      );
      setResult(`Wrote document at "${docPath}"`);
    } catch (error: any) {
      setResult(`Error setting document: ${error.message}`);
    }
  };

  const handleGet = async () => {
    setResult(null);
    const { committeeId } = form.values;
    if (!committeeId) {
      setResult('Committee ID is required');
      return;
    }

    const docPath = getDocPath();
    try {
      const data = await getFirestoreDocument<TestData>(docPath);
      if (data) {
        setResult(`Fetched from "${docPath}": ${JSON.stringify(data)}`);
      } else {
        setResult(`No document found at "${docPath}"`);
      }
    } catch (error: any) {
      setResult(`Error fetching document: ${error.message}`);
    }
  };

  const [value, setValue] = useState<Date | null>(null);

  return (
    <Container size="md" p='xl'>
    <Stack align='left' p="xl">
        <Title>Let's get set up!</Title>
        <Container size="sm">
            <TextInput
            label="What's your committee name?"
            placeholder="e.g. econ"
            {...form.getInputProps('shortName')}
            radius="lg"
            required
            />
        
            <DateInput
            label="When does your event start?"
            value={value}
            onChange={setValue}
            placeholder="Date input"
            />
        </Container>
       

        <Fieldset legend="Staff">
            <TextInput
                label="Who's on your staff team?"
                placeholder="Add staff emails here..."
                radius="lg"
            ></TextInput>
        </Fieldset>
        
        <Fieldset legend="Delegation">
            <Table>
                <thead>
                    <tr>
                        <th>Country</th>
                        <th>Delegates</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Country A</td>
                        <td>Delegate 1, Delegate 2</td>
                    </tr>
                    <tr>
                        <td>Country B</td>
                        <td>Delegate 3, Delegate 4</td>
                    </tr>
                </tbody>
            </Table>
        </Fieldset>
      {/* <Title order={2}> Test</Title>

      <form onSubmit={form.onSubmit(handleSet)}>
        <Stack>
          <TextInput
            label="Committee short name"
            placeholder="e.g. econ"
            {...form.getInputProps('shortName')}
            radius="lg"
            required
          />
          <Button radius="lg" onClick={handleGenerateCommitteeId}>
            Generate Committee ID
          </Button>

          <TextInput
            label="Committee ID"
            {...form.getInputProps('committeeId')}
            readOnly
            radius="lg"
          />

          <Stack mt="md">
            <Button type="submit" radius="lg">
              Set
            </Button>
            <Button type="button" radius="lg" onClick={handleGet}>
              Get
            </Button>
          </Stack>
        </Stack>
      </form>

      {result && (
        <Text size="sm" mt="md">
          {result}
        </Text>
      )} */}
    </Stack>
    </Container>
  );
};
