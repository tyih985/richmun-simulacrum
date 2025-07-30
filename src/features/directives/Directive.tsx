import { ReactElement } from 'react';
import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { DirectiveDoc, DirectiveStatus } from '@features/types';
import { committeeMutations } from '@mutations/committeeMutation';

type Props = {
  directive: DirectiveDoc;
  isStaff: boolean;
  cid: string;
};

export const Directive = ({ directive , isStaff, cid}: Props): ReactElement => {

  const { addDirectiveToCommittee } = committeeMutations();

  const colour = directive.read ? 'grey' : 'white'

  const updateDirective = async (directive: DirectiveDoc, status?: DirectiveStatus, read?: boolean): Promise<void> => {
    await addDirectiveToCommittee(
      cid, 
      directive.id, 
      directive.title, 
      directive.description, 
      directive.privateStatus, 
      directive.sponsors,
      directive.signatories,
      status ?? directive.passed, // if no specified new status keep old one
      read ?? directive.read, // same here
      directive.upVotes)
  }

  return (
    <Card bg={colour} w="300px" h="600px" p="md" shadow="sm">
      <Stack>
        <Text size="lg">{directive.title}</Text>
        <Text size="sm">{directive.description}</Text>
        <Text size="sm">Status: {directive.passed}</Text>
        <Text size="sm">Sponsors: {directive.sponsors.join(', ')}</Text>
        <Text size="sm">Signatories: {directive.signatories.join(', ')}</Text>
        <Text size="md">Upvotes: {directive.upVotes}</Text>
        {isStaff? (
          <Group>
            <Button onClick={() => updateDirective(directive, 'passed' as DirectiveStatus, true)}>pass</Button>
            <Button onClick={() => updateDirective(directive, 'failed' as DirectiveStatus, true)}>fail</Button>
            {/* should the mark unread make it pending again ? idk */}
            {directive.read && (<Button onClick={() => updateDirective(directive, 'pending' as DirectiveStatus, false)}>mark unread</Button>)} 
          </Group>
        ) 
        : 
        (<Button>upvote</Button>)

        }
      </Stack>
    </Card>
  );
};
