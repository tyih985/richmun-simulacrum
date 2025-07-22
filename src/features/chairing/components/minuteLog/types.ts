import { Timestamp } from 'firebase/firestore';

export type SpeakingEventType = 'start' | 'stop';

export type SpeakingLogEntry = {
  timestamp: Timestamp;
  type: SpeakingEventType;
};

export type SpeakingRecord = {
  id: string;
  committeeId: string;
  delegateId: string;
  motionId?: string;
  log: SpeakingLogEntry[];
  totalDuration?: number; // in milliseconds
};
