import { Node } from '@xyflow/react';

export const ECC_COMMITTEE_KEY = 'richmun-x-ecc';
export const ECC_COMMITTEE_MAP_KEY = 'floorplan';

export const FJCC_COMMITTEE_KEY = 'richmun-x-fjcc';
export const FJCC_COMMITTEE_MAP_KEY_1 = 'main';
export const FJCC_COMMITTEE_MAP_KEY_2 = 'underground';
export const FJCC_COMMITTEE_MAP_KEY_3 = 'zaun-tech-tree';
export const FJCC_COMMITTEE_MAP_KEY_4 = 'piltover-tech-tree';

export const BACKGROUND_NODES: Record<string, Node> = {
  [FJCC_COMMITTEE_MAP_KEY_1]: {
    id: 'main-background',
    position: { x: 0, y: 0 },
    data: {
      url: '/bg/surface.jpg',
    },
    type: 'background',
    selectable: false,
    draggable: false,
  },
  [FJCC_COMMITTEE_MAP_KEY_2]: {
    id: 'underground-background',
    position: { x: 0, y: 0 },
    data: {
      url: '/bg/underground.jpg',
    },
    type: 'background',
    selectable: false,
    draggable: false,
  },
  [FJCC_COMMITTEE_MAP_KEY_3]: {
    id: 'zaun-tech-tree-background',
    position: { x: 0, y: 0 },
    data: {
      url: '/bg/Zaun-tech-tree.jpg',
    },
    type: 'background',
    selectable: false,
    draggable: false,
  },
  [FJCC_COMMITTEE_MAP_KEY_4]: {
    id: 'piltover-tech-tree-background',
    position: { x: 0, y: 0 },
    data: {
      url: '/bg/Piltover-tech-tree.jpg',
    },
    type: 'background',
    selectable: false,
    draggable: false,
  },
};

interface AccessCategoriesType extends Record<string, unknown> {
  name: string;

  staff: string[];
  delegates: string[];
  visibiltyFactions?: Record<string, string[]>;
  // hard coded options for "everyone", "staff-only"
}

export const COMMITTEE_DATA_MAP: Record<string, AccessCategoriesType> = {
  [ECC_COMMITTEE_KEY]: {
    name: 'ECC',
    staff: ['director@richmun.ca', 'ecc@richmun.ca'],
    delegates: ['alexkim.347@gmail.com'],
  },
  [FJCC_COMMITTEE_KEY]: {
    name: 'FJCC',
    staff: ['director@richmun.ca', 'fjcc@richmun.ca'],
    delegates: ['alexkim.347@gmail.com'],
    visibiltyFactions: {
      Piltover: ['alexkim.347@gmail.com'],
      Zaun: [],
    },
  },
};

export const getCommitteeAccessLevel = (
  committeeKey: string,
  email: string,
): 'staff' | 'delegate' | false => {
  const committee = COMMITTEE_DATA_MAP[committeeKey];
  if (!committee) return false;

  if (committee.staff.includes(email)) return 'staff';
  if (committee.delegates.includes(email)) return 'delegate';

  return 'delegate';
};

export const getCommittees = (email: string): string[] => {
  return Object.entries(COMMITTEE_DATA_MAP)
    .filter(
      ([_, access]) => access.staff.includes(email) || access.delegates.includes(email),
    )
    .map(([committee]) => committee);
};

export const getAllCommitteeFactions = (committeeKey: string): string[] => {
  const committee = COMMITTEE_DATA_MAP[committeeKey];
  if (!committee || !committee.visibiltyFactions) return [];

  return Object.keys(committee.visibiltyFactions).concat(['everyone']);
};

export const getUserCommitteeFactions = (
  committeeKey: string,
  email: string,
): string[] => {
  const committee = COMMITTEE_DATA_MAP[committeeKey];
  if (!committee || !committee.visibiltyFactions) return [];

  console.log('getCommitteeFactions', committee, email);
  return Object.entries(committee.visibiltyFactions)
    .filter(([_, emails]) => emails.includes(email))
    .map(([faction]) => faction)
    .concat(['everyone']);
};
