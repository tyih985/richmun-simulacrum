import { v7 as uuid } from 'uuid';
import { nanoid as nano } from 'nanoid';

// should be a uuid v7, to be reliably unique
export const generateSimulationId = () => uuid();

// id of length 5 should be reasonably unique (expect max: 100)
const NUM_DIGITS = 5;
export const generateCommitteeId = (shortName: string) =>
  `${shortName}-${nano(NUM_DIGITS)}`;

export const generateDelegateId = (delegationShortName: string) => {
  const parsedName = delegationShortName
    .split(/[\s_\-\W]+/)
    .slice(0, 2)
    .join('-')
    .toLocaleLowerCase();
  return `${parsedName}-${nano(NUM_DIGITS)}`;
};

export const generateStaffId = (): string => `staff-${nano(NUM_DIGITS)}`;

// should be reasonably unique within a larger collection (expect max: 1000)
// a block is for rich text: description, paragraph
export const generateBlockId = () => nano(8);
export const generateNodeId = () => nano(9);
