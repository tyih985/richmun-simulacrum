import { ReactElement } from 'react';
import {
  Button,
  Checkbox,
  MultiSelect,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { generateDirectiveId } from '@packages/generateIds';
import { useCommitteeDelegates, useUserDelegate } from '@hooks/useNewStuff';
import { auth } from '@packages/firebase/firebaseAuth';
import { useParams } from 'react-router-dom';
import { DirectiveDoc } from '@features/types';
import { committeeMutations } from '@mutations/committeeMutation';

const { addDirectiveToCommittee } = committeeMutations();

export const MakeDirective = (): ReactElement => {
  const { committeeId } = useParams<{ committeeId: string }>();
  // assumes uid exists
  const { delegate } = useUserDelegate(auth.currentUser!.uid, committeeId || '');
  // const delegate = 'delegate'
  console.log('delegate:', delegate)
  const { delegates } = useCommitteeDelegates(committeeId);

  const form = useForm({
    initialValues: {
      id: generateDirectiveId(delegate?.id || ''),
      // id: generateDirectiveId(delegate),
      title: '',
      description: '',
      privateStatus: false,
      sponsors: [],
      signatories: [],
      passed: 'pending',
      read: false,
      upVotes: 0,
    } as DirectiveDoc,
    validate: {
      title: (value) =>
        value.length < 5 ? 'Title must be at least 5 characters long' : null,
      description: (value) =>
        value.length < 10 ? 'Description must be at least 10 characters long' : null,
      // sponsors: (value) => (value.includes(delegate!.id) ? 'You must be a sponsor' : null),
    },
  });

  if (!committeeId) {
    return <Text>Committee not found.</Text>;
  }

  if (!delegate) {
    return <Text>Delegate not found.</Text>;
  }

  const handleSubmit = async () => {
    try {
      await addDirectiveToCommittee(
        committeeId,
        form.values.id,
        form.values.title,
        form.values.description,
        form.values.privateStatus,
        form.values.sponsors,
        form.values.signatories,
        form.values.passed,
        form.values.read,
        form.values.upVotes,
      );
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    }
  };

  return (
    <Stack p="lg">
      <Title size="xl">{delegate.name}</Title>
      <Text>Committee: {committeeId}</Text>
      <Stack>
        <Text>Title:</Text>
        <TextInput
          required
          {...form.getInputProps('title')}
          placeholder="Enter directive title"
        />
        <Text>Description:</Text>
        <Textarea
          required
          autosize
          minRows={2}
          maxRows={10}
          {...form.getInputProps('description')}
          placeholder="Enter directive description"
        />
        <Checkbox label="Make private?" {...form.getInputProps('privateStatus')} />
        <MultiSelect
          label="Sponsors"
          data={delegates.map((d) => d.name)}
          {...form.getInputProps('sponsors')}
          placeholder="Select sponsors"
        />
        <MultiSelect
          label="Signatories"
          data={delegates.map((d) => d.name)}
          {...form.getInputProps('signatories')}
          placeholder="Select signatories"
        />
        <Button type="submit" onClick={handleSubmit}>
          Submit Directive
        </Button>
      </Stack>
    </Stack>
  );
};
