/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Paper, Button, Group, Textarea, MultiSelect, Text, Pill } from '@mantine/core';
import { ViewportPortal, useViewport } from '@xyflow/react';

import { useSelectedMapPins } from '@hooks/useSelectedMapPins';
import { useCommitteeAccess } from '@hooks/useCommitteeAccess';
import { mapNodesMutations } from '@mutations/mapNodeMutation';

const OFFSET = 80;

export const SelectedPinInfo: React.FC = () => {
  const selectedPins = useSelectedMapPins();
  const { zoom } = useViewport();
  const { accessLevel, selectedCommittee, allFactions } = useCommitteeAccess();
  const [editingPins, setEditingPins] = useState<Record<string, string>>({});
  const [editingVisibility, setEditingVisibility] = useState<Record<string, string[]>>(
    {},
  );
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const { updateNode } = mapNodesMutations();

  if (selectedPins.length === 0) {
    return null;
  }

  const handleEdit = (
    pinId: string,
    currentText: string,
    currentVisibility: string[] = [],
  ) => {
    setEditingPins((prev) => ({
      ...prev,
      [pinId]: currentText || '',
    }));
    setEditingVisibility((prev) => ({
      ...prev,
      [pinId]: currentVisibility,
    }));
  };

  const handleSave = async (pin: any) => {
    if (!selectedCommittee) return;
    // get map ID from url search params
    const urlParams = new URLSearchParams(window.location.search);
    const mapId = urlParams.get('map_key');
    if (!mapId) return;
    setIsUpdating((prev) => ({ ...prev, [pin.id]: true }));

    try {
      await updateNode(selectedCommittee, mapId, pin.id, {
        ...pin.data,
        text: editingPins[pin.id],
        visibilityFactions: editingVisibility[pin.id],
        type: 'pin',
        position: pin.position,
      });

      // Remove from editing state after successful save
      setEditingPins((prev) => {
        const newState = { ...prev };
        delete newState[pin.id];
        return newState;
      });
      setEditingVisibility((prev) => {
        const newState = { ...prev };
        delete newState[pin.id];
        return newState;
      });
    } catch (error) {
      console.error('Failed to update pin:', error);
    } finally {
      setIsUpdating((prev) => ({ ...prev, [pin.id]: false }));
    }
  };

  const handleCancel = (pinId: string) => {
    setEditingPins((prev) => {
      const newState = { ...prev };
      delete newState[pinId];
      return newState;
    });
    setEditingVisibility((prev) => {
      const newState = { ...prev };
      delete newState[pinId];
      return newState;
    });
  };

  const handleTextChange = (pinId: string, value: string) => {
    setEditingPins((prev) => ({
      ...prev,
      [pinId]: value,
    }));
  };

  const handleVisibilityChange = (pinId: string, value: string[]) => {
    setEditingVisibility((prev) => ({
      ...prev,
      [pinId]: value,
    }));
  };

  const isStaff = accessLevel === 'staff';

  return (
    <>
      {selectedPins.map((pin) => {
        const isEditing = pin.id in editingPins;
        const pinText = (pin.data?.text as string) || '';
        const pinVisibility = (pin.data?.visibilityFactions as string[]) || [];
        const displayText = isEditing ? editingPins[pin.id] : pinText;
        const displayVisibility = isEditing ? editingVisibility[pin.id] : pinVisibility;

        return (
          <ViewportPortal key={pin.id}>
            <div
              style={{
                position: 'absolute',
                left: pin.position.x - OFFSET + 100 / zoom,
                top: pin.position.y + 50 / zoom,
                transform: `translate(0%, -50%) scale(${1 / zoom})`,
                pointerEvents: 'auto',
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
                      {isStaff && (
                        <MultiSelect
                          value={displayVisibility}
                          onChange={(value) => handleVisibilityChange(pin.id, value)}
                          data={allFactions.map((faction) => ({
                            value: faction,
                            label: faction,
                          }))}
                          label="Visible to Factions"
                          placeholder="Select factions that can see this pin"
                          searchable
                          clearable
                          description="Leave empty to make visible to staff only"
                          style={{ marginBottom: '8px' }}
                          size="xs"
                        />
                      )}
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
                        <div style={{ marginBottom: '8px' }}>
                          {pinVisibility.length > 0 ? (
                            <div>
                              <Text size="xs" c="dimmed" style={{ marginBottom: '4px' }}>
                                Visible to:
                              </Text>
                              <Pill.Group>
                                {pinVisibility.map((faction) => (
                                  <Pill key={faction} size="xs">
                                    {faction}
                                  </Pill>
                                ))}
                              </Pill.Group>
                            </div>
                          ) : (
                            <Text size="xs" c="dimmed">
                              Visible to: Staff only
                            </Text>
                          )}
                        </div>
                      )}
                      {isStaff && (
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => handleEdit(pin.id, pinText, pinVisibility)}
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
