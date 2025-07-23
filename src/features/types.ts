import { Timestamp } from 'firebase/firestore';
import { SpeakingLogEntry } from './chairing/components/minuteLog/types';

export type Country = {
  name: string;
  longName?: string;
  flag?: string;
};

export type SetupFormValues = {
  committeeLongName: string;
  committeeShortName: string;
  staff: StaffDoc[];
  delegates: DelegateDoc[];
  dateRange: [Date | null, Date | null];
};

export type Role = 'staff' | 'delegate';
export type StaffRole = 'assistant director' | 'director' | 'flex staff';
export type InviteStatus = 'accepted' | 'rejected' | 'pending';
export type AttendanceStatus = 'present' | 'absent' | 'excused';
export type DirectiveStatus = 'passed' | 'failed' | 'pending';
export type SpeakerLogEntry = 'start' | 'end' | 'pause' | 'resume';
export type MotionType = 'unmoderated' | 'moderated' | 'round table';
export type UserCommitteeDoc = {
  id: string;
  role: Role;
  roleId: string;
  inviteStatus: InviteStatus;
  staffRole?: StaffRole;
};

export type CommitteeDoc = {
  id: string;
  longName: string;
  shortName: string;
  startDate: Timestamp;
  endDate: Timestamp;
};

export type StaffDoc = {
  id: string;
  owner: boolean;
  staffRole: StaffRole;
  email: string;
  inviteStatus: InviteStatus;
};

export type DelegateDoc = {
  id: string;
  name: string;
  longName?: string;
  email: string;
  inviteStatus: InviteStatus;
  totalSpeakingDuration: number;
  positionPaperSent: boolean;
  spoke: boolean;
};

export type DirectiveDoc = {
  id: string;
  title: string;
  description: string;
  privateStatus: boolean;
  sponsors: string[];
  signatories: string[];
  passed: DirectiveStatus;
  read: boolean;
  upVotes?: number;
};

export type MotionDoc = {
  id: string;
  delegate: string;
  type: MotionType;
  totalTime?: number;
  speakingTime?: number;
  topic: string;
  currentSpeaker: string; // delegate ID
};

export type MotionSpeakerDoc = {
  id: string;
  order: number;
};

export type MotionSpeakerLogDoc = {
  id: string;
  type: SpeakerLogEntry;
  timestamp: EpochTimeStamp;
};

export type RollCallDoc = {
  id: string;
  timestamp: Timestamp;
};

export type RollCallDelegateDoc = {
  id: string;
  timestamp: Timestamp;
  name: string;
  attendanceStatus: AttendanceStatus;
};

export const ROLE_OPTIONS = ['director', 'assistant director', 'flex staff'] as const;
export type RoleOption = (typeof ROLE_OPTIONS)[number];
