import { InviteStatus, UserCommitteeDoc } from "@features/types";
import { committeeQueries } from "@mutations/yeahglo";

const { getUserCommittees } = committeeQueries;

export const getCommitteesForUser = async (
  userCommittees: UserCommitteeDoc[],
  status: InviteStatus = 'accepted', // default is accepted
) => {
  // Filter by invite status
  const filtered = userCommittees.filter((uc) => uc.inviteStatus === status);
  console.log('User Committees:', userCommittees);

  return filtered;
};
