// nodes should be memo-ized

import { InformationNodeType } from '@lib/informationMap/infoNodes';
import { Handle, Position } from '@xyflow/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ConceptNode = ({
  data,
}: {
  data: InformationNodeType & {
    direction?: string;
  };
}) => {
  const isHorizontal = data.direction === 'LR';

  return (
    <>
      <Handle type="target" position={isHorizontal ? Position.Left : Position.Top} />

      <label htmlFor="text">{data.name}</label>

      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        id="a"
      />
      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        id="b"
      />
    </>
  );
};
