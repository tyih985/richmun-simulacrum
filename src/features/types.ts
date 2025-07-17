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

export const ROLE_OPTIONS = ['director', 'assistant director', 'flex staff'] as const;
export type RoleOption = (typeof ROLE_OPTIONS)[number];
