import {
  createFirestoreDocument,
  deleteFirestoreDocument,
  updateFirestoreDocument,
} from '@packages/firestoreAsQuery/firestoreRequests';
import {
  committeePath,
  committeeDelegatePath,
  committeeStaffMemberPath,
  committeeDirectivePath,
  committeeMotionPath,
  committeeRollCallPath,
  userCommitteePath,
  committeeRollCallDelegatePath,
  motionSpeakerPath,
  motionSpeakerLogPath,
} from '@packages/firestorePaths';
import {
  Role,
  StaffRole,
  InviteStatus,
  DirectiveStatus,
  MotionType,
  AttendanceStatus,
  SpeakerLogEntry,
} from 'src/features/types';
import { Timestamp } from 'firebase/firestore';

export const committeeMutations = () => {
  const createCommittee = (
    committeeId: string,
    longName: string,
    shortName: string,
    startDate: Date,
    endDate: Date,
  ) => {
    const path = committeePath(committeeId);
    const data = { longName, shortName, startDate, endDate };
    console.log('Creating committee at:', path, 'with data:', data);
    return createFirestoreDocument(path, data, true);
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
    inviteStatus: InviteStatus,
  ) => {
    const path = userCommitteePath(uid, committeeId);
    const data = { role, roleId, inviteStatus };
    console.log('Adding user committee at:', path, 'with data:', data);
    return createFirestoreDocument(path, data, true);
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
    const data = { owner, staffRole, email, inviteStatus };
    console.log('Adding staff to committee at:', path, 'with data:', data);
    return createFirestoreDocument(path, data, true);
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
    spoke: boolean = false,
  ) => {
    const path = committeeDelegatePath(committeeId, delegateId);
    const data = {
      name,
      email,
      inviteStatus,
      minutes,
      positionPaperSent,
      spoke,
    };
    console.log('Adding delegate to committee at:', path, 'with data:', data);
    return createFirestoreDocument(path, data, true);
  };

  const removeDelegateFromCommittee = (committeeId: string, delegateId: string) => {
    const path = committeeDelegatePath(committeeId, delegateId);
    return deleteFirestoreDocument(path);
  };

  const addRollCallToCommittee = (
    committeeId: string,
    rollCallId: string,
    timestamp: Timestamp,
  ) => {
    const path = committeeRollCallPath(committeeId, rollCallId);
    return createFirestoreDocument(path, { rollCallId, timestamp }, true);
  };

  const removeRollCallFromCommittee = (committeeId: string, rollCallId: string) => {
    const path = committeeRollCallPath(committeeId, rollCallId);
    return deleteFirestoreDocument(path);
  };

  const addRollCallDelegateToCommittee = (
    committeeId: string,
    rollCallId: string,
    delegateId: string,
    timestamp: Timestamp,
    name: string,
    attendanceStatus: AttendanceStatus = 'absent',
  ) => {
    const path = committeeRollCallDelegatePath(committeeId, rollCallId, delegateId);
    return createFirestoreDocument(
      path,
      { delegateId, timestamp, name, attendanceStatus },
      true,
    );
  };

  const removeRollCallDelegateFromCommittee = (
    committeeId: string,
    rollCallId: string,
    delegateId: string,
  ) => {
    const path = committeeRollCallDelegatePath(committeeId, rollCallId, delegateId);
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
    const baseData = {
      directiveId,
      title,
      description,
      privateStatus,
      sponsors,
      signatories,
      passed,
      read,
    };

    if (privateStatus) {
      console.log('Adding PRIVATE directive at:', path, 'with data:', baseData);
      return createFirestoreDocument(path, baseData, true);
    }

    const publicData = { ...baseData, upVotes };
    console.log('Adding PUBLIC directive at:', path, 'with data:', publicData);
    return createFirestoreDocument(path, publicData, true);
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
    topic: string = '',
  ) => {
    const path = committeeMotionPath(committeeId, motionId);
    const data: any = { delegate, type, topic };
    if (totalTime !== undefined) data.totalTime = totalTime;
    if (speakingTime !== undefined) data.speakingTime = speakingTime;

    console.log('Adding committee motion at:', path, 'with data:', data);
    return createFirestoreDocument(path, data, true);
  };

  const removeCommitteeMotion = (committeeId: string, motionId: string) => {
    const path = committeeMotionPath(committeeId, motionId);
    return deleteFirestoreDocument(path);
  };

  const addMotionSpeaker = (
    committeeId: string,
    motionId: string,
    delegateId: string,
    order: number,
  ) => {
    const path = motionSpeakerPath(committeeId, motionId, delegateId);
    const data = { delegateId, order };
    return createFirestoreDocument(path, data, true);
  };

  const removeMotionSpeaker = (
    committeeId: string,
    motionId: string,
    delegateId: string,
  ) => {
    const path = motionSpeakerPath(committeeId, motionId, delegateId);
    return deleteFirestoreDocument(path);
  };

  const addMotionSpeakerLog = (
    committeeId: string,
    motionId: string,
    delegateId: string,
    logId: string,
    type: SpeakerLogEntry,
    timestamp: Timestamp,
  ) => {
    const path = motionSpeakerLogPath(committeeId, motionId, delegateId, logId);
    const data = { type, timestamp };
    return createFirestoreDocument(path, data, true);
  };

  const removeMotionSpeakerLog = (
    committeeId: string,
    motionId: string,
    speakerId: string,
    logId: string,
  ) => {
    const path = motionSpeakerLogPath(committeeId, motionId, speakerId, logId);
    return deleteFirestoreDocument(path);
  };

  const updateUserCommitteeInvite = (
    uid: string,
    committeeId: string,
    inviteStatus: InviteStatus,
  ) => {
    const path = userCommitteePath(uid, committeeId);
    return updateFirestoreDocument(path, { inviteStatus });
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
    addRollCallToCommittee,
    removeRollCallFromCommittee,
    addRollCallDelegateToCommittee,
    removeRollCallDelegateFromCommittee,
    updateUserCommitteeInvite,
    addMotionSpeaker,
    removeMotionSpeaker,
    addMotionSpeakerLog,
    removeMotionSpeakerLog,
  };
};
