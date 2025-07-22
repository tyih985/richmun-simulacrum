import { Timestamp } from 'firebase/firestore';
import { SpeakingLogEntry, SpeakingEventType } from './types';

export const addSpeakingEvent = (log: SpeakingLogEntry[], type: SpeakingEventType): SpeakingLogEntry[] => {
  return [...log, { timestamp: Timestamp.now(), type }];
};

export const calculateTotalDuration = (log: SpeakingLogEntry[]): number => {
  const sorted = [...log].sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
  let total = 0;
  for (let i = 0; i < sorted.length - 1; i += 2) {
    const start = sorted[i];
    const stop = sorted[i + 1];
    if (start.type === 'start' && stop.type === 'stop') {
      total += stop.timestamp.toMillis() - start.timestamp.toMillis();
    }
  }
  return total;
};
