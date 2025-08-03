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

export const toDate = (s: string | Date | Timestamp | null): Date | null => {
  if (s && s instanceof Date) {
    return new Date(s);
  }

  if (s && s instanceof Timestamp) {
    return s.toDate();
  }

  if (s) {
    return parseLocalDate(s);
  }

  return null;
};

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  // month is 0-indexed in JS Date constructor
  return new Date(year, month - 1, day);
}

export const checkForDuplicateEmails = (emails: { email: string }[]) => {
  const emailList = emails
    .map(entry => entry.email.trim().toLowerCase())
    .filter(email => email !== ''); // Remove empty strings

  const uniqueEmails = new Set(emailList);
  
  if (uniqueEmails.size !== emailList.length) {
    return 'Duplicate emails found';
  }

  return null;
};
