import React from 'react';
import { Paper } from '@mantine/core';
import { ViewportPortal } from '@xyflow/react';
import { useSelectedMapPins } from '../state/hooks/useSelectedMapPins';
import { useViewport } from '@xyflow/react';

const OFFSET = 80;

// Mock data for demonstration
const mockPinData = {
  temperature: '24°C',
  humidity: '65%',
  windSpeed: '12 km/h',
  pressure: '1013 hPa',
  location: 'Downtown Area',
  lastUpdated: '2 minutes ago',
};

export const SelectedPinInfo: React.FC = () => {
  const selectedPins = useSelectedMapPins();
  const { zoom } = useViewport();

  if (selectedPins.length === 0) {
    return null;
  }

  return (
    <>
      {selectedPins.map((pin) => (
        <ViewportPortal key={pin.id}>
          <div
            style={{
              position: 'absolute',
              left: pin.position.x - OFFSET + 100 / zoom,
              top: pin.position.y + 50 / zoom,
              transform: `translate(0%, -50%) scale(${1 / zoom})`,
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          >
            <Paper
              shadow="md"
              p="md"
              style={{
                minWidth: 200,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div style={{ fontSize: '14px', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  {mockPinData.location}
                </div>
                <div>Temperature: {mockPinData.temperature}</div>
                <div>Humidity: {mockPinData.humidity}</div>
                <div>Wind Speed: {mockPinData.windSpeed}</div>
                <div>Pressure: {mockPinData.pressure}</div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#666',
                    marginTop: '8px',
                  }}
                >
                  Updated: {mockPinData.lastUpdated}
                </div>
              </div>
            </Paper>
          </div>
        </ViewportPortal>
      ))}
    </>
  );
};
