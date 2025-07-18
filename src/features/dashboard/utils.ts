import { InviteStatus, UserCommitteeDoc } from "@features/types";
import { committeeQueries } from "@mutations/yeahglo";

export const getCommitteesForUser = async (
  uid: string,
  status: InviteStatus = 'accepted', // default is accepted
) => {
  // Get all user-committee relationships
  const userCommittees: UserCommitteeDoc[] = await committeeQueries.getUserCommittees(uid);
  console.log('User Committees:', userCommittees);
  
  // Filter by invite status
  const filtered = userCommittees.filter((uc) => uc.inviteStatus === status);

  // Fetch full committee data for each filtered committee
  const committeeData = await Promise.all(
    filtered.map((uc) => committeeQueries.getCommittee(uc.id))
  );

  // Remove any null results (committees that weren't found)
  return committeeData.filter((c): c is NonNullable<typeof c> => c !== null);
};
