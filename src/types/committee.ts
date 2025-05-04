import { MarkdownType } from './primitives';

export type CommitteeType = {
  id?: string;
  shortName: string;
  longName: string;
  description?: MarkdownType;
  /**
   * subcollections:
   * ~/staff
   * ~/delegates
   * ~/directives
   */

  archived?: boolean;
};
