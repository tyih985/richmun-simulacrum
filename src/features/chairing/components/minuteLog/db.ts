import { createFirestoreDocument, getFirestoreDocument } from '@packages/firestoreAsQuery';
import { SpeakingRecord, SpeakingLogEntry, SpeakingEventType } from './types';
import { Timestamp } from 'firebase/firestore';
import { calculateTotalDuration } from './util';

export const SPEAKING_LOG_PATH = (committeeId: string, delegateId: string, motionId?: string) =>
  `committees/${committeeId}/speakingLogs/${delegateId}${motionId ? `_${motionId}` : ''}`;

export const logSpeakingEvent = async (
  committeeId: string,
  delegateId: string,
  type: SpeakingEventType,
  motionId?: string,
): Promise<void> => {
  const path = SPEAKING_LOG_PATH(committeeId, delegateId, motionId);
  const existing = await getFirestoreDocument<SpeakingRecord>(path);

  const updatedLog: SpeakingLogEntry[] = [
    ...(existing?.log || []),
    { timestamp: Timestamp.now(), type },
  ];

  const totalDuration = calculateTotalDuration(updatedLog);

  await createFirestoreDocument(path, {
    id: `${delegateId}${motionId ? `_${motionId}` : ''}`,
    committeeId,
    delegateId,
    motionId,
    log: updatedLog,
    totalDuration,
  });
};
