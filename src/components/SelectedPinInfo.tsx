/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Paper, TextInput, Button, Group, Textarea } from '@mantine/core';
import { ViewportPortal } from '@xyflow/react';
import { useSelectedMapPins } from '../state/hooks/useSelectedMapPins';
import { useCommitteeAccess } from '../state/hooks/useCommitteeAccess';
import { useViewport } from '@xyflow/react';
import { mapNodesMutations } from '../state/mutations/mapNodeMutation';

const OFFSET = 80;

export const SelectedPinInfo: React.FC = () => {
  const selectedPins = useSelectedMapPins();
  const { zoom } = useViewport();
  const { accessLevel, selectedCommittee } = useCommitteeAccess();
  const [editingPins, setEditingPins] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  
  const { updateNode } = mapNodesMutations();

  if (selectedPins.length === 0) {
    return null;
  }

  const handleEdit = (pinId: string, currentText: string) => {
    setEditingPins(prev => ({
      ...prev,
      [pinId]: currentText || ''
    }));
  };

  const handleSave = async (pin: any) => {
    if (!selectedCommittee) return;
    // get map ID from url search params
    const urlParams = new URLSearchParams(window.location.search);
    const mapId = urlParams.get('map_key');
    if (!mapId) return;
    setIsUpdating(prev => ({ ...prev, [pin.id]: true }));
    
    try {
      await updateNode(
        selectedCommittee,
        mapId, // You'll need to pass the mapId - see note below
        pin.id,
        {
          ...pin.data,
          text: editingPins[pin.id],
          type: 'pin',
          position: pin.position
        }
      );
      
      // Remove from editing state after successful save
      setEditingPins(prev => {
        const newState = { ...prev };
        delete newState[pin.id];
        return newState;
      });
    } catch (error) {
      console.error('Failed to update pin:', error);
    } finally {
      setIsUpdating(prev => ({ ...prev, [pin.id]: false }));
    }
  };

  const handleCancel = (pinId: string) => {
    setEditingPins(prev => {
      const newState = { ...prev };
      delete newState[pinId];
      return newState;
    });
  };

  const handleTextChange = (pinId: string, value: string) => {
    setEditingPins(prev => ({
      ...prev,
      [pinId]: value
    }));
  };

  const isStaff = accessLevel === 'staff';

  return (
    <>
      {selectedPins.map((pin) => {
        const isEditing = pin.id in editingPins;
        const pinText = (pin.data?.text as string) || '';
        const displayText = isEditing ? editingPins[pin.id] : pinText;

        return (
          <ViewportPortal key={pin.id}>
            <div
              style={{
                position: 'absolute',
                left: pin.position.x - OFFSET + 100 / zoom,
                top: pin.position.y + 50 / zoom,
                transform: `translate(0%, -50%) scale(${1 / zoom})`,
                pointerEvents: 'auto', // Changed from 'none' to allow interaction
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
                  {isEditing ? (
                    <div>
                      <Textarea
                        value={displayText}
                        onChange={(event) => 
                          handleTextChange(pin.id, event.currentTarget?.value || '')
                        }
                        placeholder="Enter pin description..."
                        style={{ marginBottom: '8px' }}
                        autosize
                        minRows={2}
                      />
                      <Group gap="xs">
                        <Button
                          size="xs"
                          onClick={() => handleSave(pin)} 
                          loading={isUpdating[pin.id]}
                          disabled={isUpdating[pin.id]}
                        >
                          Save
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleCancel(pin.id)}
                          disabled={isUpdating[pin.id]}
                        >
                          Cancel
                        </Button>
                      </Group>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: '8px', minHeight: '20px' }}>
                        {pinText || 'No description'}
                      </div>
                      {isStaff && (
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => handleEdit(pin.id, pinText)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Paper>
            </div>
          </ViewportPortal>
        );
      })}
    </>
  );
};
