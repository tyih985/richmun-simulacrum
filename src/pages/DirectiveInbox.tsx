import { ReactElement, useEffect, useState } from 'react';
import { Group, Text } from '@mantine/core';
import { Directive } from '@features/directives/Directive';
import {
  useCommitteeDirectives,
  useUserCommittees,
  useUserIsStaff,
} from '@hooks/useNewStuff';
import { useParams } from 'react-router-dom';
import { DirectiveDoc } from '@features/types';
import { auth } from '@packages/firebase/firebaseAuth';

export const DirectiveInbox = (): ReactElement => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const { directives } = useCommitteeDirectives(committeeId);

  // assumes user is not null lol
  const { userCommittees } = useUserCommittees(auth.currentUser!.uid);
  const { isStaff } = useUserIsStaff(auth.currentUser!.uid, committeeId!);

  const [visibleDirectives, setVisibleDirectives] = useState<DirectiveDoc[]>([]);

  useEffect(() => {
    if (!directives) return;

    if (isStaff) {
      setVisibleDirectives(directives);
    } else {
      setVisibleDirectives(directives.filter((d) => !d.privateStatus));
    }
  }, [directives, isStaff]);

  return (
    <Group p="lg">
      {visibleDirectives.map((directive) => (
        <Directive directive={directive} isStaff={isStaff} cid={committeeId}></Directive>
      ))}
    </Group>
  );
};
