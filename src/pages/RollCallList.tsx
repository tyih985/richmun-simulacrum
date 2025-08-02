import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Title, Button, Loader, Paper } from '@mantine/core';
import { committeeMutations } from '@mutations/committeeMutation';
import { committeeQueries } from '@mutations/committeeQueries';
import { Timestamp } from 'firebase/firestore';
import { RollCallRow } from '@features/rollCall/components/RollCallRow';
import { generateRollCallId } from '@packages/generateIds';
import type { RollCallDoc, DelegateDoc } from '@features/types';

export const RollCallList = () => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const navigate = useNavigate();
  const [rollCalls, setRollCalls] = useState<RollCallDoc[] | null>(null);
  const { addRollCallToCommittee, addRollCallDelegateToCommittee } = committeeMutations();

  useEffect(() => {
    if (!committeeId) return;
    (async () => {
      const docs = await committeeQueries.getCommitteeRollCalls(committeeId);
      setRollCalls(docs.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds));
    })();
  }, [committeeId]);

  const handleNewRollCall = async () => {
    if (!committeeId) return;

    try {
      const rollCallId = generateRollCallId(committeeId);
      const now = Timestamp.now();
      await addRollCallToCommittee(committeeId, rollCallId, now);
      console.log(`Created roll-call ${rollCallId} at`, now.toDate());

      const delegateDocs: DelegateDoc[] =
        await committeeQueries.getCommitteeDelegates(committeeId);
      console.log('Fetched delegates for attendance:', delegateDocs);

      const placeholder = Timestamp.fromMillis(0);
      await Promise.all(
        delegateDocs.map(async (d) => {
          try {
            await addRollCallDelegateToCommittee(
              committeeId,
              rollCallId,
              d.id,
              placeholder,
              d.name,
              'absent',
            );
            console.log(`Attendance doc created for delegate ${d.id} (${d.name})`);
          } catch (e) {
            console.error(
              `Failed to create attendance for delegate ${d.id} (${d.name}):`,
              e,
            );
          }
        }),
      );

      console.log('All attendance documents processed');
      navigate(`/committee/${committeeId}/rollcall/${rollCallId}`, { replace: false });
    } catch (err) {
      console.error('Error in handleNewRollCall:', err);
    }
  };

  if (rollCalls === null) {
    return <Loader />;
  }

  return (
    <Stack p="lg">
      <Title order={2}>Roll Calls</Title>
      {rollCalls.length === 0 ? (
        <Paper p="md">No roll calls yet.</Paper>
      ) : (
        rollCalls.map((rc) => (
          <RollCallRow
            key={rc.id}
            rollCall={rc}
            onClick={() => navigate(`/committee/${committeeId}/rollcall/${rc.id}`)}
          />
        ))
      )}
      <Button onClick={handleNewRollCall}>New Roll Call</Button>
    </Stack>
  );
};
