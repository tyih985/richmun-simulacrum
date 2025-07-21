import { ReactElement } from 'react';
import { Card, Stack, Text } from '@mantine/core';
import { DirectiveDoc } from '@features/types';

type Props = {
  directive: DirectiveDoc;
};

export const Directive = ({ directive }: Props): ReactElement => {
  return (
    <Card bg="gray" w="300px" h="600px" p="md" shadow="sm">
      <Stack>
        <Text size="lg">{directive.title}</Text>
        <Text size="sm">{directive.description}</Text>
        <Text size="sm">Status: {directive.passed}</Text>
        <Text size="sm">Sponsors: {directive.sponsors.join(', ')}</Text>
        <Text size="sm">Signatories: {directive.signatories.join(', ')}</Text>
        {/* <Text size="md">Upvotes: {directive.upVotes}</Text> */}
      </Stack>
    </Card>
  );
};
