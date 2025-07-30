import dayjs, { Dayjs } from 'dayjs';
import { InviteStatus, UserCommitteeDoc } from '@features/types';
import { committeeQueries } from '@mutations/committeeQueries';
import { Timestamp } from 'firebase/firestore';
import { time } from 'console';

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
  console.log('User Committees:', filtered);

  // Fetch full committee data for each filtered committee
  const committeeData = await Promise.all(
    filtered.map((uc) => committeeQueries.getCommittee(uc.id)),
  );

  // Remove any null results (committees that weren't found)
  return committeeData.filter((c): c is NonNullable<typeof c> => c !== null);
};

export const dateToTimestamp = (date: Date | string): Timestamp => {
  console.log("typeof:", typeof date);

  if (date instanceof Date) {
    console.log('date!')
    return Timestamp.fromDate(date);
  }

  else {
    console.log('string!')
    return Timestamp.fromDate(new Date(date));
  }
  
};

export const normalizeToDate = (d: Date | Timestamp | null): Date | null =>
  d instanceof Timestamp ? d.toDate() : d ?? null;

export const firestoreTimestampToDate = (timestamp: Timestamp | Date | null): Date | null => {
  if (!timestamp) {
    return null;
  }
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  } else {
    return timestamp;
  }
};

// export function normalizeDateToUTC(date: Date): Date {
//   return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
// }
