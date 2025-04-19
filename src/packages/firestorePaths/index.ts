export const usersPath = (userId: string) => `users/${userId}`;
export const userEventsPath = (userId: string) => `users/${userId}/events_ref`;
export const userEventPath = (userId: string, simulationId: string) => `users/${userId}/events_ref/${simulationId}`;

export const simulationPath = (simulationId: string) => `simulations/${simulationId}`;

/**
 * The USERS sub-collection is the mapping of users to their role
 * whether it's as a staff, or a delegate, or co-delegates, this is the canonical mapping
 */ 
export const simulationUsersPath = (simulationId: string) =>
  `simulations/${simulationId}/users`;
export const simulationUserPath = (simulationId: string, userId: string) =>
  `simulations/${simulationId}/users/${userId}`;

export const committeesPath = (simulationId: string) =>
  `simulations/${simulationId}/committees`;
export const committeePath = (simulationId: string, committeeId: string) =>
  `simulations/${simulationId}/committees/${committeeId}`;

export const committeeDelegationsPath = (simulationId: string, committeeId: string) =>
  `simulations/${simulationId}/committees/${committeeId}/delegations`;
export const committeeDelegationPath = (
  simulationId: string,
  committeeId: string,
  delegateId: string,
) => `simulations/${simulationId}/committees/${committeeId}/delegations/${delegateId}`;
export const delegationDirectivesPath = (
  simulationId: string,
  committeeId: string,
  delegateId: string,
) => `simulations/${simulationId}/committees/${committeeId}/delegations/${delegateId}/directives_ref`;
export const delegationDirectivePath = (
  simulationId: string,
  committeeId: string,
  delegateId: string,
  directiveId: string,
) => `simulations/${simulationId}/committees/${committeeId}/delegations/${delegateId}/directives_ref/${directiveId}`;

export const directivesPath = (simulationId: string, committeeId: string) =>
  `simulations/${simulationId}/committees/${committeeId}/directives`;
export const directivePath = (
  simulationId: string,
  committeeId: string,
  directiveId: string,
) => `simulations/${simulationId}/committees/${committeeId}/directives/${directiveId}`;
export const directiveEditorsPath = (
  simulationId: string,
  committeeId: string,
  directiveId: string,
) =>
  `simulations/${simulationId}/committees/${committeeId}/directives/${directiveId}/editors`;
