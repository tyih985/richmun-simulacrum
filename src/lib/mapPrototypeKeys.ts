export const ECC_COMMITTEE_KEY = 'richmun-x-ecc';
export const ECC_COMMITTEE_MAP_KEY = 'floorplan';

export const FJCC_COMMITTEE_KEY = 'richmun-x-fjcc';
export const FJCC_COMMITTEE_MAP_KEY_1 = 'main';
export const FJCC_COMMITTEE_MAP_KEY_2 = 'underground';
export const FJCC_COMMITTEE_MAP_KEY_3 = 'zaun-tech-tree';
export const FJCC_COMMITTEE_MAP_KEY_4 = 'piltover-tech-tree';

interface AccessCategoriesType extends Record<string, unknown> {
  staff: string[];
  delegates: string[];
};

export const COMMITTEE_DATA_MAP: Record<string, AccessCategoriesType> = {
  [ECC_COMMITTEE_KEY]: {
    staff: ['director@richmun.ca', 'ecc@richmun.ca'],
    delegates: ['alexkim.347@gmail.com'],
  },
  [FJCC_COMMITTEE_KEY]: {
    staff: ['director@richmun.ca', 'fjcc@richmun.ca'],
    delegates: ['alexkim.347@gmail.com'],
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
