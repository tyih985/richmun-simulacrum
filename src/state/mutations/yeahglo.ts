import {
  getFirestoreDocument,
  getFirestoreCollection,
} from '@packages/firestoreAsQuery/firestoreRequests';
import {
  committeePath,
  committeeStaffPath,
  committeeStaffMemberPath,
  committeeDelegatesPath,
  committeeDelegatePath,
  committeeDirectivesPath,
  committeeDirectivePath,
  committeeMotionsPath,
  committeeMotionPath,
  userCommitteesPath,
} from '@packages/firestorePaths';
import {
  Role,
  StaffRole,
  InviteStatus,
  AttendanceStatus,
  DirectiveStatus,
  MotionType,
  UserCommittee,
  StaffDoc,
  DelegateDoc,
  DirectiveDoc,
  MotionDoc,
} from 'src/features/types';

export const committeeQueries = {
  getCommittee: async (
    committeeId: string,
  ): Promise<{
    committeeId: string;
    longName: string;
    shortName: string;
    startDate: Date;
    endDate: Date;
  } | null> => {
    const path = committeePath(committeeId);
    const doc = await getFirestoreDocument<{
      longName: string;
      shortName: string;
      startDate: Date;
      endDate: Date;
    }>(path);
    if (!doc) return null;
    return { committeeId, ...doc };
  },

  getUserCommittees: async (
    uid: string,
  ): Promise<UserCommittee[]> => {
    const path = userCommitteesPath(uid);
    const docs = await getFirestoreCollection<
      { id: string; role: Role; roleId: string; inviteStatus: InviteStatus }
    >(path);
    return Promise.all(
      docs.map(async (d) => {
        const base: UserCommittee = {
          committeeId: d.id,
          role: d.role,
          roleId: d.roleId,
          inviteStatus: d.inviteStatus,
        };

        if (d.role === 'staff') {
          const staffDoc = await getFirestoreDocument<{ staffRole: StaffRole }>(
            committeeStaffMemberPath(d.id, d.roleId),
          );
          base.staffRole = staffDoc?.staffRole;
        }

        return base;
      }),
    );
  },

  getCommitteeStaffMember: async (
    committeeId: string,
    staffId: string,
  ): Promise<{
    staffId: string;
    owner: boolean;
    staffRole: StaffRole;
    email: string;
    inviteStatus: InviteStatus;
  } | null> => {
    const path = committeeStaffMemberPath(committeeId, staffId);
    const doc = await getFirestoreDocument<{
      owner: boolean;
      staffRole: StaffRole;
      email: string;
      inviteStatus: InviteStatus;
    }>(path);

    if (!doc) return null;
    return {
      staffId,
      owner: doc.owner,
      staffRole: doc.staffRole,
      email: doc.email,
      inviteStatus: doc.inviteStatus,
    };
  },

  getCommitteeStaff: async (
    committeeId: string,
  ): Promise<StaffDoc[]> => {
    const path = committeeStaffPath(committeeId);
    const docs = await getFirestoreCollection<StaffDoc>(path);
    return docs.map((d) => ({
      staffId: d.staffId,
      owner: d.owner,
      staffRole: d.staffRole,
      email: d.email,
      inviteStatus: d.inviteStatus,
    }));
  },

  getCommitteeDelegate: async (
    committeeId: string,
    delegateId: string,
  ): Promise<{
    delegateId: string;
    name: string;
    email: string;
    inviteStatus: InviteStatus;
    minutes: number;
    positionPaperSent: boolean;
    attendanceStatus: AttendanceStatus;
    spoke: boolean;
  } | null> => {
    const path = committeeDelegatePath(committeeId, delegateId);
    const doc = await getFirestoreDocument<Omit<DelegateDoc, 'delegateId'>>(path);
    if (!doc) return null;
    return { delegateId, ...doc };
  },

  getCommitteeDelegates: async (
    committeeId: string,
  ): Promise<DelegateDoc[]> => {
    const path = committeeDelegatesPath(committeeId);
    const docs = await getFirestoreCollection<DelegateDoc>(path);
    return docs.map((d) => ({
      delegateId: d.delegateId,
      name: d.name,
      email: d.email,
      inviteStatus: d.inviteStatus,
      minutes: d.minutes,
      positionPaperSent: d.positionPaperSent,
      attendanceStatus: d.attendanceStatus,
      spoke: d.spoke,
    }));
  },

  getCommitteeDirective: async (
    committeeId: string,
    directiveId: string,
  ): Promise<{
    directiveId: string;
    title: string;
    description: string;
    privateStatus: boolean;
    sponsors: string[];
    signatories: string[];
    passed: DirectiveStatus;
    read: boolean;
    upVotes?: number;
  } | null> => {
    const path = committeeDirectivePath(committeeId, directiveId);
    const doc = await getFirestoreDocument<Omit<DirectiveDoc, 'directiveId'>>(path);
    if (!doc) return null;
    return { directiveId, ...doc };
  },

  getCommitteeDirectives: async (
    committeeId: string,
  ): Promise<DirectiveDoc[]> => {
    const path = committeeDirectivesPath(committeeId);
    const docs = await getFirestoreCollection<DirectiveDoc>(path);
    return docs.map((d) => ({
      directiveId: d.directiveId,
      title: d.title,
      description: d.description,
      privateStatus: d.privateStatus,
      sponsors: d.sponsors,
      signatories: d.signatories,
      passed: d.passed,
      read: d.read,
      upVotes: d.upVotes,
    }));
  },

  getCommitteeMotion: async (
    committeeId: string,
    motionId: string,
  ): Promise<{
    motionId: string;
    delegate: string;
    type: MotionType;
    totalTime?: number;
    speakingTime?: number;
  } | null> => {
    const path = committeeMotionPath(committeeId, motionId);
    const doc = await getFirestoreDocument<Omit<MotionDoc, 'motionId'>>(path);
    if (!doc) return null;
    return { motionId, ...doc };
  },

  getCommitteeMotions: async (
    committeeId: string,
  ): Promise<MotionDoc[]> => {
    const path = committeeMotionsPath(committeeId);
    const docs = await getFirestoreCollection<MotionDoc>(path);
    return docs.map((d) => ({
      motionId: d.motionId,
      delegate: d.delegate,
      type: d.type,
      totalTime: d.totalTime,
      speakingTime: d.speakingTime,
    }));
  },
};
