import { DateTimeStamp, MarkdownType } from './primitives';
import { ParticipantType } from './roles';
/**
 * The reference might be out of date if another person edits
 * the duplicate data should be eliminated at some point via cloud functions
 */
export type SimulationReferenceType = {
  participatingAs: ParticipantType;
} & Partial<SimulationType>

export type SimulationType = {
  id?: string;
  shortName: string;
  longName: string;
  dates: {
    start: DateTimeStamp;
    end: DateTimeStamp;
  };
  description?: MarkdownType
  supportEmail: string
  archived?: boolean;
};
