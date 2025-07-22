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
  StaffRole,
  UserCommitteeDoc,
  CommitteeDoc,
  StaffDoc,
  DelegateDoc,
  DirectiveDoc,
  MotionDoc,
} from 'src/features/types';

export const committeeQueries = {
  getCommittee: async (committeeId: string): Promise<CommitteeDoc | null> => {
    const path = committeePath(committeeId);
    const doc = await getFirestoreDocument<Omit<CommitteeDoc, 'id'>>(path);
    console.log('Fetched committee doc:', doc);
    if (!doc) return null;
    return { id: committeeId, ...doc };
  },

  getUserCommittees: async (uid: string): Promise<UserCommitteeDoc[]> => {
    const path = userCommitteesPath(uid);
    const docs = await getFirestoreCollection<any>(path);
    console.log('Fetched user committees collection:', docs);

    return Promise.all(
      docs.map(async (d: any) => {
        const base: UserCommitteeDoc = {
          id: d.id,
          role: d.role,
          roleId: d.roleId,
          inviteStatus: d.inviteStatus,
        };

        if (d.role === 'staff') {
          const staffDoc = await getFirestoreDocument<{ staffRole: StaffRole }>(
            committeeStaffMemberPath(d.id, d.roleId),
          );
          console.log(`Fetched staff doc for roleId ${d.roleId}:`, staffDoc);
          base.staffRole = staffDoc?.staffRole;
        }

        return base;
      }),
    );
  },

  getCommitteeStaffMember: async (
    committeeId: string,
    staffId: string,
  ): Promise<StaffDoc | null> => {
    const path = committeeStaffMemberPath(committeeId, staffId);
    const doc = await getFirestoreDocument<Omit<StaffDoc, 'id'>>(path);
    console.log('Fetched committee staff member doc:', doc);
    if (!doc) return null;
    return { id: staffId, ...doc };
  },

  getCommitteeStaff: async (committeeId: string): Promise<StaffDoc[]> => {
    const path = committeeStaffPath(committeeId);
    const docs = await getFirestoreCollection<any>(path);
    console.log('Fetched committee staff collection:', docs);
    return docs.map((doc: any) => ({
      id: doc.id,
      ...doc,
    })) as StaffDoc[];
  },

  getCommitteeDelegate: async (
    committeeId: string,
    delegateId: string,
  ): Promise<DelegateDoc | null> => {
    const path = committeeDelegatePath(committeeId, delegateId);
    const doc = await getFirestoreDocument<Omit<DelegateDoc, 'id'>>(path);
    console.log('Fetched committee delegate doc:', doc);
    if (!doc) return null;
    return { id: delegateId, ...doc };
  },

  getCommitteeDelegates: async (committeeId: string): Promise<DelegateDoc[]> => {
    const path = committeeDelegatesPath(committeeId);
    const docs = await getFirestoreCollection<any>(path);
    console.log('Fetched committee delegates collection:', docs);
    return docs.map((doc: any) => ({
      id: doc.id,
      ...doc,
    })) as DelegateDoc[];
  },

  getCommitteeDirective: async (
    committeeId: string,
    directiveId: string,
  ): Promise<DirectiveDoc | null> => {
    const path = committeeDirectivePath(committeeId, directiveId);
    const doc = await getFirestoreDocument<Omit<DirectiveDoc, 'id'>>(path);
    console.log('Fetched committee directive doc:', doc);
    if (!doc) return null;
    return { id: directiveId, ...doc };
  },

  getCommitteeDirectives: async (committeeId: string): Promise<DirectiveDoc[]> => {
    const path = committeeDirectivesPath(committeeId);
    const docs = await getFirestoreCollection<any>(path);
    console.log('Fetched committee directives collection:', docs);
    return docs.map((doc: any) => ({
      id: doc.id,
      ...doc,
    })) as DirectiveDoc[];
  },

  getCommitteeMotion: async (
    committeeId: string,
    motionId: string,
  ): Promise<MotionDoc | null> => {
    const path = committeeMotionPath(committeeId, motionId);
    const doc = await getFirestoreDocument<Omit<MotionDoc, 'id'>>(path);
    console.log('Fetched committee motion doc:', doc);
    if (!doc) return null;
    return { id: motionId, ...doc };
  },

  getCommitteeMotions: async (committeeId: string): Promise<MotionDoc[]> => {
    const path = committeeMotionsPath(committeeId);
    const docs = await getFirestoreCollection<any>(path);
    console.log('Fetched committee motions collection:', docs);
    return docs.map((doc: any) => ({
      id: doc.id,
      ...doc,
    })) as MotionDoc[];
  },
};
