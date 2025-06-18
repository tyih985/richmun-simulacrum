/**
 * The USERS sub-collection is the mapping of users to their role
 * whether it's as a staff, or a delegate, or co-delegates, this is the canonical mapping
 */
export const usersPath = (userId: string) => `users/${userId}`;

// events are stored on a separate list, to reference one or more simulations if needed
export const userEventsPath = (userId: string) => `users/${userId}/events_ref`;
export const userEventPath = (userId: string, committeeId: string) =>
  `users/${userId}/events_ref/${committeeId}`;

// Committees collection paths
export const committeesPath = () => 'committees';
export const committeePath = (committeeId: string) => `committees/${committeeId}`;

// Visibility groups paths within a committee
export const committeeVisibilityGroupsPath = (committeeId: string) =>
  `committees/${committeeId}/visibility_groups`;
export const committeeVisibilityGroupPath = (committeeId: string, groupId: string) =>
  `committees/${committeeId}/visibility_groups/${groupId}`;

// Delegates paths within a committee
export const committeeDelegatesPath = (committeeId: string) =>
  `committees/${committeeId}/delegates`;
export const committeeDelegatePath = (committeeId: string, delegateId: string) =>
  `committees/${committeeId}/delegates/${delegateId}`;

// Staff paths within a committee
export const committeeStaffPath = (committeeId: string) =>
  `committees/${committeeId}/staff`;
export const committeeStaffMemberPath = (committeeId: string, staffId: string) =>
  `committees/${committeeId}/staff/${staffId}`;

// Maps paths within a committee
export const committeeMapsPath = (committeeId: string) =>
  `committees/${committeeId}/maps`;
export const committeeMapPath = (committeeId: string, mapId: string) =>
  `committees/${committeeId}/maps/${mapId}`;

// Map nodes paths
export const committeeMapNodesPath = (committeeId: string, mapId: string) =>
  `committees/${committeeId}/maps/${mapId}/nodes`;
export const committeeMapNodePath = (
  committeeId: string,
  mapId: string,
  nodeId: string,
) => `committees/${committeeId}/maps/${mapId}/nodes/${nodeId}`;
export const committeeMapBackgroundNodesPath = (committeeId: string, mapId: string) =>
  `committees/${committeeId}/maps/${mapId}/background_nodes`;

// ─────────────────────────────────────────────── Tyler stuff ───────────────────────────────────────────────

// Staff at root
export const staffPath = () => 'staff';
export const staffMemberPath = (staffId: string) => `staff/${staffId}`;

// Delegates at root
export const delegatesPath = () => 'delegates';
export const delegatePath = (delegateId: string) => `delegates/${delegateId}`;

// User's list of committees
export const userCommitteesPath = (userId: string) => `users/${userId}/committees`;
export const userCommitteePath = (userId: string, committeeId: string) =>
  `users/${userId}/committees/${committeeId}`;