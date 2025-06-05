/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextInput,
  Button,
  Group,
  Textarea,
  MultiSelect,
  Text,
  Pill,
  ActionIcon,
  Flex,
} from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
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

  // Reset editing state when pins become unselected
  useEffect(() => {
    const selectedPinIds = new Set(selectedPins.map(pin => pin.id));
    
    setEditingPins(prev => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([pinId]) => selectedPinIds.has(pinId))
      );
      return filtered;
    });
    
    setEditingVisibility(prev => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([pinId]) => selectedPinIds.has(pinId))
      );
      return filtered;
    });
    
    setIsUpdating(prev => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([pinId]) => selectedPinIds.has(pinId))
      );
      return filtered;
    });
  }, [selectedPins]);

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
                  width: 260,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div style={{ fontSize: '14px', lineHeight: 1.4 }}>
                  {isEditing ? (
                    <div>
                      {isStaff && (
                        <MultiSelect
                          value={displayVisibility}
                          onChange={(value) => handleVisibilityChange(pin.id, value)}
                          data={allFactions.map((faction) => ({
                            value: faction,
                            label: faction,
                          }))}
                          label="Visible to Factions"
                          placeholder="Select who can see this"
                          searchable
                          clearable
                          description="Leave empty to make visible to staff only"
                          style={{ marginBottom: '8px' }}
                          size="sm"
                        />
                      )}
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
                      <Group gap="sm">
                        <Button
                          size="sm"
                          onClick={() => handleSave(pin)}
                          loading={isUpdating[pin.id]}
                          disabled={isUpdating[pin.id]}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
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
                      {isStaff && (
                        <Flex
                          justify="space-between"
                          align="center"
                          style={{ marginBottom: '8px' }}
                        >
                          <Group gap="sm">
                            {pinVisibility.length > 0 ? (
                              pinVisibility.map((faction) => (
                                <Pill key={faction} size="sm">
                                  {faction}
                                </Pill>
                              ))
                            ) : (
                              <Pill size="sm" c="dimmed">
                                Staff only
                              </Pill>
                            )}
                          </Group>
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            onClick={() => handleEdit(pin.id, pinText, pinVisibility)}
                          >
                            <IconPencil />
                          </ActionIcon>
                        </Flex>
                      )}
                      <div style={{ minHeight: '20px' }}>
                        {pinText || 'No description'}
                      </div>
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
