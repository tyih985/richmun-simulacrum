import { InformationNodeKeysType } from './infoNodes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const edgeTypes = ['default', 'step', 'smoothstep', 'straight'] as const;

export type FlowEdgeType = {
  id: string;
  source: InformationNodeKeysType;
  target: InformationNodeKeysType;
  data?: {
    startLabel?: string;
    label?: string;
    endLabel?: string;
  };
  type: (typeof edgeTypes)[number];
};

type SimplifiedEdgeType = {
  source: InformationNodeKeysType;
  target: InformationNodeKeysType;
  label?: string;
};

export const extractNodesInOrder = (
  edges: FlowEdgeType[] | SimplifiedEdgeType[],
): InformationNodeKeysType[] => {
  const nodesSet = new Set<InformationNodeKeysType>();
  edges.forEach((edge) => {
    if (!nodesSet.has(edge.source)) nodesSet.add(edge.source);
    if (!nodesSet.has(edge.target)) nodesSet.add(edge.target);
  });
  return Array.from(nodesSet);
};

const convertSimplifeidEdge = (e: SimplifiedEdgeType): FlowEdgeType => {
  return {
    id: `${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    type: 'default',
    ...(e.label && { data: { label: e.label } }),
  };
};
export const getEdgesFromSimplified = (es: SimplifiedEdgeType[]): FlowEdgeType[] =>
  es.map((e) => convertSimplifeidEdge(e));

export const MainFlowEdges: FlowEdgeType[] = getEdgesFromSimplified([
  {
    source: 'root',
    target: 'ui_library',
    label: 'relies on a',
  },
  {
    source: 'ui_library',
    target: 'mantine_ui',
    label: 'such as',
  },
  {
    source: 'ui_library',
    target: 'ui_theme_pattern',
    label: 'uses',
  },
  {
    source: 'ui_theme_pattern',
    target: 'theme_runtime_config',
    label: 'is derived from',
  },
  {
    source: 'root',
    target: 'vite',
    label: 'utliizes',
  },
  {
    source: 'vite',
    target: 'build_time',
    label: 'influences',
  },
  {
    source: 'build_time',
    target: 'environment_variables',
    label: 'utliizes',
  },
  {
    source: 'vite',
    target: 'server_side_rendering',
    label: 'enhances',
  },
  {
    source: 'root',
    target: 'react',
    label: 'is built on',
  },
  {
    source: 'react',
    target: 'react_component_lifecycle',
    label: 'is based on',
  },
  {
    source: 'root',
    target: 'firebase',
    label: 'uses as a back-end (as a service)',
  },
  {
    source: 'root',
    target: 'progressive_web_application',
    label: 'is built as a',
  },
  {
    source: 'progressive_web_application',
    target: 'workbox',
  },
  {
    source: 'progressive_web_application',
    target: 'service_worker',
  },
  {
    source: 'progressive_web_application',
    target: 'manifest',
    label: 'relies on',
  },
]);

export const WhiteLabelFlowEdges: FlowEdgeType[] = getEdgesFromSimplified([
  {
    source: 'root',
    target: 'theme_runtime_config',
  },
  {
    source: 'theme_runtime_config',
    target: 'ui_theme_pattern',
  },
  {
    source: 'ui_theme_pattern',
    target: 'ui_library',
  },
  {
    source: 'theme_runtime_config',
    target: 'manifest',
  },
  {
    source: 'manifest',
    target: 'progressive_web_application',
  },
  {
    source: 'root',
    target: 'environment_variables',
  },
  {
    source: 'environment_variables',
    target: 'firebase',
  },
]);
