import dayjs, { Dayjs } from 'dayjs';
import { InviteStatus, UserCommitteeDoc } from '@features/types';
import { committeeQueries } from '@mutations/yeahglo';
import { Timestamp } from 'firebase/firestore';

export const getCommitteeBy = async (
  uid: string,
  status: InviteStatus = 'accepted', // default is accepted
) => {
  // Get all user-committee relationships
  const userCommittees: UserCommitteeDoc[] =
    await committeeQueries.getUserCommittees(uid);
  console.log('User Committees:', userCommittees);

  // Filter by invite status
  const filtered = userCommittees.filter((uc) => uc.inviteStatus === status);
  console.log('User Committees:', userCommittees);

  // Fetch full committee data for each filtered committee
  const committeeData = await Promise.all(
    filtered.map((uc) => committeeQueries.getCommittee(uc.id)),
  );

  // Remove any null results (committees that weren't found)
  return committeeData.filter((c): c is NonNullable<typeof c> => c !== null);
};

export const dateToTimestamp = (date: Dayjs | Date): Timestamp => {
  if (dayjs.isDayjs(date)) {
    return Timestamp.fromDate(date.toDate());
  }
  return Timestamp.fromDate(date);
}

export const firestoreTimestampToDate = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }

  if (timestamp instanceof Date) {
    return timestamp;
  }
}