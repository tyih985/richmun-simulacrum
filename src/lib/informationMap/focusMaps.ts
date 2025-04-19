import { XYPosition } from '@xyflow/react';
import { FlowEdgeType, MainFlowEdges, WhiteLabelFlowEdges } from './infoEdges';
import { InformationNodeKeysType, InformationNodeType } from './infoNodes';

export type FocusMapType = {
  key: string;
  focusLabel: string;
  rootNode: InformationNodeType;
  edges: FlowEdgeType[];
  nodePositions?: Record<InformationNodeKeysType, XYPosition>;
  nodeDetailPriorities: Record<InformationNodeKeysType, string[]>; // priority order of keys, anything else is irrelevant details
};

export const MainFocusMap: FocusMapType = {
  key: 'main',
  focusLabel: 'Introducing my front-end boilerplate',
  rootNode: {
    name: 'My front-end boilerplate',
    description:
      'This boilerplate emerged from the need to combine various technologies and front-end needs for various projects.',
    details: {
      '0': {
        label: 'White labeling',
        body: 'includes support for whitelabeled custom deployments',
        type: 'reference',
      },
      '1': {
        label: 'Mantine UI library',
        body: 'set-up to utilize mantine UI, the most under-appreciated library',
        type: 'reference',
      },
      '2': {
        label: 'Accessibility support',
        body: 'accessibility is almost never a business priority, but it is nice to have, and this boilerplate is set-up to allow for typopgrahy resizing and font changes',
        type: 'reference',
      },
      '3': {
        label: 'Firebase encouraged',
        body: 'for an MVP, building a custom back-end is almost never needed! Just use firebase!',
        type: 'reference',
      },
    },
  },
  edges: MainFlowEdges,
  nodeDetailPriorities: {},
};

export const WhiteLabelFocusMap: FocusMapType = {
  key: 'WhiteLabel',
  focusLabel: 'How do White Label this boilerplate',
  rootNode: {
    name: 'white-labeling deployments',
    description:
      'White labelling allows for this front-end application to be branded for different organizations,',
    details: {
      '0': {
        label: 'Customizable areas',
        body: 'such as by changing the default typography and applying brand colors, and even changing the sharp/roundness of edges.',
        type: 'reference',
      },
    },
  },
  edges: WhiteLabelFlowEdges,
  nodeDetailPriorities: {},
};
