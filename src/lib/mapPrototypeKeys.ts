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
      url: '/bg/Zaun-tech-tree.png',
    },
    type: 'background',
    selectable: false,
    draggable: false,
  },
  [FJCC_COMMITTEE_MAP_KEY_4]: {
    id: 'piltover-tech-tree-background',
    position: { x: 0, y: 0 },
    data: {
      url: '/bg/Piltover-tech-tree.png',
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
    staff: [
      'director@richmun.ca',
      'fjcc@richmun.ca',
      'piltover@richmun.ca',
      'zaun@richmun.ca',
    ],
    delegates: [
      // 'alexkim.347@gmail.com',
      'peartonevangeline@gmail.com',
      'ziganclark@gmail.com',
      'branxuu@gmail.com',
      'jhuh@vancouvercollege.ca',
      'mayairipapaya@yahoo.com',
      'amypshumka@gmail.com',
      'cateshumka27@mylfabc.ca',
      '27jye@sjs.ca',
      's.arjun.sidhu@icloud.com',
      'ultimatemastersword3@gmail.com',
      'larryzhang8@outlook.com',
      'feier2024shen@gmail.com',
      'chenorlando@outlook.com',
      'annazhou222@hotmail.com',
      'celina.ps.chow@gmail.com',
      'emlee.cui@gmail.com',
      'maximilian.chong10@gmail.com',
      'ashlowe54@gmail.com',
      'anguslee111@gmail.com',
      'rmcgrath@vancouvercollege.ca',
      'mias28@yorkhouse.ca',
      'lheritierzoe20@gmail.com',
      'jacqui.leung@gmail.com',
      'ethan202107@gmail.com',
      'christina1hsia@gmail.com',
      'jessie.yin007@gmail.com',
      'sophiekx21@gmail.com',
      'yiningkang@hotmail.com',
      'lexhsiao20@gmail.com',
      'evan.borodow@icloud.com',
    ],
    visibiltyFactions: {
      Piltover: [
        // 'alexkim.347@gmail.com',
        'peartonevangeline@gmail.com',
        'ziganclark@gmail.com',
        'branxuu@gmail.com',
        'jhuh@vancouvercollege.ca',
        'mayairipapaya@yahoo.com',
        'amypshumka@gmail.com',
        'cateshumka27@mylfabc.ca',
        '27jye@sjs.ca',
        's.arjun.sidhu@icloud.com',
        'ultimatemastersword3@gmail.com',
        'larryzhang8@outlook.com',
        'feier2024shen@gmail.com',
        'chenorlando@outlook.com',
        'annazhou222@hotmail.com',
        'celina.ps.chow@gmail.com',
        'emlee.cui@gmail.com',
      ],
      Zaun: [
        // 'alexkim.347@gmail.com',
        'maximilian.chong10@gmail.com',
        'ashlowe54@gmail.com',
        'anguslee111@gmail.com',
        'rmcgrath@vancouvercollege.ca',
        'mias28@yorkhouse.ca',
        'lheritierzoe20@gmail.com',
        'jacqui.leung@gmail.com',
        'ethan202107@gmail.com',
        'christina1hsia@gmail.com',
        'jessie.yin007@gmail.com',
        'sophiekx21@gmail.com',
        'yiningkang@hotmail.com',
        'lexhsiao20@gmail.com',
        'evan.borodow@icloud.com',
      ],
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
