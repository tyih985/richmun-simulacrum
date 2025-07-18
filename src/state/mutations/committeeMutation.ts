import { firestoreDb } from '@packages/firebase/firestoreDb';
import {
  createFirestoreDocument,
  deleteFirestoreDocument,
  getFirestoreDocument,
  getFirestoreCollection,
} from '@packages/firestoreAsQuery/firestoreRequests';
import {
  committeePath,
  committeeDelegatePath,
  committeeStaffMemberPath,
  committeeDirectivePath,
  committeeMotionPath,
  userCommitteesPath,
  userCommitteePath,
} from '@packages/firestorePaths';
import { Role, StaffRole, InviteStatus, AttendanceStatus, DirectiveStatus, MotionType } from 'src/features/types';

export const committeeMutations = () => {
  const createCommittee = (
    committeeId: string,
    longName: string,
    shortName: string,
    startDate: Date,
    endDate: Date,
  ) => {
    const path = committeePath(committeeId);
    return createFirestoreDocument(
      path,
      { longName, shortName, startDate, endDate },
      true,
    );
  };

  const deleteCommittee = (committeeId: string) => {
    const path = committeePath(committeeId);
    return deleteFirestoreDocument(path);
  };

  const addUserCommittee = (
    uid: string,
    committeeId: string,
    role: Role,
    roleId: string,
    inviteStatus: InviteStatus = 'pending',
  ) => {
    const path = userCommitteePath(uid, committeeId);
    return createFirestoreDocument(path, { role, roleId, inviteStatus }, true);
  };

  const removeUserCommittee = (uid: string, committeeId: string) => {
    const path = userCommitteePath(uid, committeeId);
    return deleteFirestoreDocument(path);
  };

  const addStaffToCommittee = (
    committeeId: string,
    staffId: string,
    owner: boolean = false,
    staffRole: StaffRole,
    email: string,
    inviteStatus: InviteStatus = 'pending',
  ) => {
    const path = committeeStaffMemberPath(committeeId, staffId);
    return createFirestoreDocument(path, { owner, staffRole, email, inviteStatus }, true);
  };

  const removeStaffFromCommittee = (committeeId: string, staffId: string) => {
    const path = committeeStaffMemberPath(committeeId, staffId);
    return deleteFirestoreDocument(path);
  };

  const addDelegateToCommittee = (
    committeeId: string,
    delegateId: string,
    name: string,
    email: string,
    inviteStatus: InviteStatus = 'pending',
    minutes: number = 0,
    positionPaperSent = false,
    attendanceStatus: AttendanceStatus = 'absent',
    spoke: boolean = false,
  ) => {
    const path = committeeDelegatePath(committeeId, delegateId);
    return createFirestoreDocument(path, { name, email, inviteStatus, minutes, positionPaperSent, attendanceStatus, spoke }, true);
  };

  const removeDelegateFromCommittee = (committeeId: string, delegateId: string) => {
    const path = committeeDelegatePath(committeeId, delegateId);
    return deleteFirestoreDocument(path);
  };

  const addDirectiveToCommittee = (
    committeeId: string,
    directiveId: string,
    title: string,
    description: string,
    privateStatus: boolean,
    sponsors: string[],
    signatories: string[],
    passed: DirectiveStatus = 'pending',
    read: boolean = false,
    upVotes: number = 0,
  ) => {
    const path = committeeDirectivePath(committeeId, directiveId);
    if (privateStatus) {
      return createFirestoreDocument(path, { directiveId, title, description, privateStatus, sponsors, signatories, passed, read }, true);
    }
    return createFirestoreDocument(path, { directiveId, title, description, privateStatus, sponsors, signatories, passed, read, upVotes }, true);
  };

  const removeDirectiveFromCommittee = (committeeId: string, directiveId: string) => {
    const path = committeeDirectivePath(committeeId, directiveId);
    return deleteFirestoreDocument(path);
  };

  const addCommitteeMotion = (
    committeeId: string,
    motionId: string,
    delegate: string,
    type: MotionType,
    totalTime?: number,
    speakingTime?: number,
  ) => {
  const path = committeeMotionPath(committeeId, motionId);
  const data: any = {
    delegate,
    type,
  };
  if (totalTime !== undefined) {
    data.totalTime = totalTime;
  }
  if (speakingTime !== undefined) {
    data.speakingTime = speakingTime;
  }
  return createFirestoreDocument(path, data, true);
  };

  const removeCommitteeMotion = (committeeId: string, motionId: string) => {
    const path = committeeMotionPath(committeeId, motionId);
    return deleteFirestoreDocument(path);
  };

  return {
    createCommittee,
    deleteCommittee,
    addUserCommittee,
    removeUserCommittee,
    addStaffToCommittee,
    removeStaffFromCommittee,
    addDelegateToCommittee,
    removeDelegateFromCommittee,
    addDirectiveToCommittee,
    removeDirectiveFromCommittee,
    addCommitteeMotion,
    removeCommitteeMotion,
  };
};
