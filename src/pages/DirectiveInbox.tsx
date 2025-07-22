import { ReactElement } from 'react';
import { Group, Text } from '@mantine/core';
import { Directive } from '@features/directives/Directive';
import { DirectiveDoc } from '@features/types';
import { useCommitteeDirectives } from '@hooks/useNewStuff';
import { useParams } from 'react-router-dom';

export const DirectiveInbox = (): ReactElement => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const { directives } = useCommitteeDirectives(committeeId);

  return (
    <Group p="lg">
      {directives.map((directive) => (
        <Directive directive={directive}></Directive>
      ))}
    </Group>
  );
};
