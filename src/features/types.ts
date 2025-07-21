export type Country = {
  value: string;
  name: string;
  longName?: string;
  flag?: string;
};

export type Delegate = {
  country: Country;
  email: string;
};

export type Staff = {
  staffRole: StaffRole;
  email: string;
};

export type SetupFormValues = {
  committeeLongName: string;
  committeeShortName: string;
  staff: Staff[];
  delegates: Delegate[];
  dateRange: [Date | null, Date | null];
};

export type Role = 'staff' | 'delegate';
export type StaffRole = 'assistant director' | 'director' | 'flex staff';
export type InviteStatus = 'accepted' | 'rejected' | 'pending';
export type AttendanceStatus = 'present' | 'absent' | 'excused';
export type DirectiveStatus = 'passed' | 'failed' | 'pending';
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
  startDate: Date;
  endDate: Date;
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
  email: string;
  inviteStatus: InviteStatus;
  minutes: number;
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
};

export type RollCallDoc = {
  id: string;
  timestamp: 
};

export const ROLE_OPTIONS = ['director', 'assistant director', 'flex staff'] as const;
export type RoleOption = (typeof ROLE_OPTIONS)[number];
