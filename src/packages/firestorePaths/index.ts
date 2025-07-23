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

// User's list of committees
export const userCommitteesPath = (userId: string) => `users/${userId}/committees`;
export const userCommitteePath = (userId: string, committeeId: string) =>
  `users/${userId}/committees/${committeeId}`;

export const committeeDelegateDirectivesPath = (
  committeeId: string,
  delegateId: string,
) => `committees/${committeeId}/delegates/${delegateId}/directives`;
export const committeeDelegateDirectivePath = (
  committeeId: string,
  delegateId: string,
  directiveId: string,
) => `committees/${committeeId}/delegates/${delegateId}/directives/${directiveId}`;

export const committeeDirectivesPath = (committeeId: string) =>
  `committees/${committeeId}/directives`;
export const committeeDirectivePath = (committeeId: string, directiveId: string) =>
  `committees/${committeeId}/directives/${directiveId}`;

export const committeeMotionsPath = (committeeId: string) =>
  `committees/${committeeId}/motions`;
export const committeeMotionPath = (committeeId: string, motionId: string) =>
  `committees/${committeeId}/motions/${motionId}`;

export const committeeRollCallsPath = (committeeId: string) =>
  `committees/${committeeId}/rollcalls`;
export const committeeRollCallPath = (committeeId: string, rollCallId: string) =>
  `committees/${committeeId}/rollcalls/${rollCallId}`;

export const committeeRollCallsDelegatesPath = (
  committeeId: string,
  rollCallId: string,
) => `committees/${committeeId}/rollcalls/${rollCallId}/delegates`;
export const committeeRollCallDelegatePath = (
  committeeId: string,
  rollCallId: string,
  delegateId: string,
) => `committees/${committeeId}/rollcalls/${rollCallId}/delegates/${delegateId}`;

export const motionSpeakersPath = (committeeId: string, motionId: string) =>
  `committees/${committeeId}/motions/${motionId}/speakers`;
export const motionSpeakerPath = (committeeId: string, motionId: string, delegateId: string) =>
  `committees/${committeeId}/motions/${motionId}/speakers/${delegateId}`;

export const motionSpeakerLogsPath = (committeeId: string, motionId: string, delegateId: string) =>
  `committees/${committeeId}/motions/${motionId}/speakers/${delegateId}/logs`;
export const motionSpeakerLogPath = (committeeId: string, motionId: string, delegateId: string, logId: string) =>
  `committees/${committeeId}/motions/${motionId}/speakers/${delegateId}/logs/${logId}`;