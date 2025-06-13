import { ReactElement, useEffect, useState } from 'react';
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
} from '@mantine/core';
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
      await createFirestoreDocument<TestData>(path, { message: form.values.committeeName }, true);
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

  return (
    <Container size="md" p="xl">
      <Stack align="left">
        <Title order={2}>Let’s get set up!</Title>

        <Container size="sm" px={0}>
          <TextInput
            label="What’s your committee name?"
            placeholder="e.g. econ"
            {...form.getInputProps('committeeName')}
            radius="lg"
            required
          />

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
            placeholder="Add staff emails here..."
            radius="lg"
          />
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
