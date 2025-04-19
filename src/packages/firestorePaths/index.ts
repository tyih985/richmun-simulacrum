export const usersPath = (userId: string) => `users/${userId}`;
export const userSimulationsPath = (userId: string) => `users/${userId}/staff`;
export const userAssignmentsPath = (userId: string) => `users/${userId}/assignments`;

export const simulationPath = (simulationId: string) => `simulations/${simulationId}`;

export const simulationUsersPath = (simulationId: string) =>
  `simulations/${simulationId}/users`;
export const simulationUserPath = (simulationId: string, userId: string) =>
  `simulations/${simulationId}/users/${userId}`;

export const committeesPath = (simulationId: string) =>
  `simulations/${simulationId}/committees`;
export const committeePath = (simulationId: string, committeeId: string) =>
  `simulations/${simulationId}/committees/${committeeId}`;

export const committeeDelegatesPath = (simulationId: string, committeeId: string) =>
  `simulations/${simulationId}/committees/${committeeId}/delegates`;
export const committeeDelegatePath = (
  simulationId: string,
  committeeId: string,
  delegateId: string,
) => `simulations/${simulationId}/committees/${committeeId}/delegates/${delegateId}`;

export const directivesPath = (simulationId: string, committeeId: string) =>
  `simulations/${simulationId}/committees/${committeeId}/directives`;
export const directivePath = (
  simulationId: string,
  committeeId: string,
  directiveId: string,
) => `simulations/${simulationId}/committees/${committeeId}/delegates/${directiveId}`;
export const directiveEditorsPath = (
  simulationId: string,
  committeeId: string,
  directiveId: string,
) =>
  `simulations/${simulationId}/committees/${committeeId}/delegates/${directiveId}/editors`;
