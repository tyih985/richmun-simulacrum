import React, { memo } from 'react';
import { Handle, NodeProps, Position, Node } from '@xyflow/react';

type MapBackgroundProps = {
  mapUrl: string;
  height?: number;
  width?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MapBackgroundNode = memo(({ data }: NodeProps<Node<MapBackgroundProps>>) => {
  const {
    height,
    width,
    mapUrl = 'https://media.istockphoto.com/id/1308342070/vector/city-map-navigation-location-map-with-city-street-roads-gps-navigator-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZddvO4teNrq8_MsG2vszU_V44ykmJqc9anrJvgXpGSM=',
  } = data;

  return (
    <>
      <img
        src={mapUrl}
        alt="Map"
        height={height}
        width={width}
      />
    </>
  );
});
