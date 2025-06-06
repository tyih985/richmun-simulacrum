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
  Modal,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ViewportPortal, useViewport } from '@xyflow/react';
import { useSelectedMapPins } from '@hooks/useSelectedMapPins';
import { useCommitteeAccess } from '@hooks/useCommitteeAccess';
import { useMapMeta } from '@hooks/useMapMeta';
import { mapNodesMutations } from '@mutations/mapNodeMutation';

const OFFSET = 80;

export const SelectedNodeInfo: React.FC = () => {
  const selectedPins = useSelectedMapPins();
  const { zoom } = useViewport();
  const { accessLevel, selectedCommittee, allFactions } = useCommitteeAccess();
  const [editingPins, setEditingPins] = useState<Record<string, string>>({});
  const [editingVisibility, setEditingVisibility] = useState<Record<string, string[]>>(
    {},
  );
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pinToDelete, setPinToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { updateNode, deleteNode } = mapNodesMutations();

  // Get map metadata for visibility restrictions
  const urlParams = new URLSearchParams(window.location.search);
  const mapId = urlParams.get('map_key');
  const mapMeta = useMapMeta({
    committeeId: selectedCommittee || '',
    mapId: mapId || '',
  });

  // Reset editing state when pins become unselected
  useEffect(() => {
    const selectedPinIds = new Set(selectedPins.map((pin) => pin.id));

    setEditingPins((prev) => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([pinId]) => selectedPinIds.has(pinId)),
      );
      return filtered;
    });

    setEditingVisibility((prev) => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([pinId]) => selectedPinIds.has(pinId)),
      );
      return filtered;
    });

    setIsUpdating((prev) => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([pinId]) => selectedPinIds.has(pinId)),
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
    const urlParams = new URLSearchParams(window.location.search);
    const mapId = urlParams.get('map_key');
    if (!mapId) return;
    setIsUpdating((prev) => ({ ...prev, [pin.id]: true }));

    try {
      // If visibility is empty, default to staff-only when saving
      const visibilityToSave =
        editingVisibility[pin.id]?.length > 0
          ? editingVisibility[pin.id]
          : ['staff-only'];

      await updateNode(selectedCommittee, mapId, pin.id, {
        ...pin.data,
        text: editingPins[pin.id],
        visibilityFactions: visibilityToSave,
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
    const previousValue = editingVisibility[pinId] || [];

    // Handle the case where MultiSelect shows ['staff-only'] as default but state is empty
    const actualPreviousValue = previousValue.length === 0 ? [] : previousValue;

    // Find what was added or removed
    const added = value.filter((v) => !actualPreviousValue.includes(v));
    const removed = actualPreviousValue.filter((v) => !value.includes(v));

    let newValue = [...value];

    // Special case: if previous was empty and we're adding multiple including staff-only,
    // it means user clicked on a regular faction (staff-only was just the display default)
    if (
      actualPreviousValue.length === 0 &&
      added.length > 1 &&
      added.includes('staff-only')
    ) {
      // Remove staff-only from the added items and use only the user's actual selection
      const userSelection = added.filter((f) => f !== 'staff-only');
      newValue = userSelection;
    }
    // If 'everyone' or 'staff-only' was explicitly added (and it's the only addition), remove all other factions
    else if (
      added.length === 1 &&
      (added.includes('everyone') || added.includes('staff-only'))
    ) {
      newValue = added;
    }
    // If a regular faction was added and 'everyone' or 'staff-only' exists, remove them
    else if (added.length > 0) {
      const hasSpecialFaction =
        newValue.includes('everyone') || newValue.includes('staff-only');
      if (hasSpecialFaction) {
        newValue = newValue.filter((f) => f !== 'everyone' && f !== 'staff-only');
      }
    }

    setEditingVisibility((prev) => ({
      ...prev,
      [pinId]: newValue,
    }));
  };

  const handleDeleteClick = (pin: any) => {
    setPinToDelete(pin);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCommittee || !pinToDelete) return;

    const urlParams = new URLSearchParams(window.location.search);
    const mapId = urlParams.get('map_key');
    if (!mapId) return;

    setIsDeleting(true);

    try {
      await deleteNode(selectedCommittee, mapId, pinToDelete.id);

      // Clean up any editing state for this pin
      setEditingPins((prev) => {
        const newState = { ...prev };
        delete newState[pinToDelete.id];
        return newState;
      });
      setEditingVisibility((prev) => {
        const newState = { ...prev };
        delete newState[pinToDelete.id];
        return newState;
      });
      setIsUpdating((prev) => {
        const newState = { ...prev };
        delete newState[pinToDelete.id];
        return newState;
      });

      setDeleteModalOpen(false);
      setPinToDelete(null);
    } catch (error) {
      console.error('Failed to delete pin:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPinToDelete(null);
  };

  const isStaff = accessLevel === 'staff';

  // Get map's visible factions to determine which factions should be enabled
  const mapVisibleFactions = Array.from(
    new Set(mapMeta.visibilityFactions || []).add('staff-only').add('everyone'),
  );

  return (
    <>
      <Modal
        opened={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Delete Pin"
        centered
      >
        <Text mb="md">
          Are you sure you want to delete this pin? This action cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </Group>
      </Modal>

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
                  width: 280,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div style={{ fontSize: '14px', lineHeight: 1.4 }}>
                  {isEditing ? (
                    <div>
                      {isStaff && (
                        <MultiSelect
                          value={
                            displayVisibility.length > 0
                              ? displayVisibility
                              : ['staff-only']
                          }
                          onChange={(value) => handleVisibilityChange(pin.id, value)}
                          data={allFactions.map((faction) => ({
                            value: faction,
                            label: faction,
                            disabled: !mapVisibleFactions.includes(faction),
                          }))}
                          label="Visible to Factions"
                          // placeholder="Select who can see this"
                          searchable
                          description="Only factions that can see this map are available"
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
                      <Flex justify="space-between">
                        <Button
                          size="xs"
                          variant="white"
                          color="red"
                          onClick={() => handleDeleteClick(pin)}
                          disabled={isUpdating[pin.id]}
                        >
                          <IconTrash size={16} />
                        </Button>
                        <Flex>
                          <Button
                            size="xs"
                            variant="white"
                            onClick={() => handleCancel(pin.id)}
                            disabled={isUpdating[pin.id]}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => handleSave(pin)}
                            loading={isUpdating[pin.id]}
                            disabled={isUpdating[pin.id]}
                          >
                            Save
                          </Button>
                        </Flex>
                      </Flex>
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
