import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Select, MultiSelect, Text, Flex, Avatar, Menu } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

import { useCommitteeAccess } from '@hooks/useCommitteeAccess';
import { useMapMeta } from '@hooks/useMapMeta';
import { mapMetaMutations } from '@mutations/mapMetaMutation';
import { useSession } from '@hooks/useSession';

import { MapView } from './MapView';

export const MapPage = () => {
  const { committeeId } = useParams();
  const {
    availableCommittees,
    availableMaps,
    setSelectedCommittee,
    accessLevel,
    allFactions,
  } = useCommitteeAccess();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout, sessionUser } = useSession();

  const mapKey = searchParams.get('map_key');

  // Get current map metadata
  const mapMeta = useMapMeta({
    committeeId: committeeId || '',
    mapId: mapKey || availableMaps[0],
  });

  // Get mutation functions
  const { updateVisibilityFactions } = mapMetaMutations({
    enable: accessLevel === 'staff',
  });

  useEffect(() => {
    // Check if committeeId is missing or not in available committees
    if (!committeeId || !availableCommittees.includes(committeeId)) {
      navigate('/c/', { replace: true });
      return;
    } else {
      setSelectedCommittee(committeeId);
    }

    // If no map_key is specified and there are available maps, set the first one
    // also check if the mapKey is valid
    if (!mapKey || (mapKey && !availableMaps.includes(mapKey))) {
      setSearchParams({ map_key: availableMaps[0] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    committeeId,
    availableCommittees,
    navigate,
    mapKey,
    availableMaps,
    setSearchParams,
  ]);

  // Don't render content if validation fails
  if (!committeeId || !availableCommittees.includes(committeeId)) {
    return null;
  }

  // Don't render if we don't have a valid map key yet
  if (!mapKey || !availableMaps.includes(mapKey)) return null;

  const handleMapChange = (newMapKey: string | null) => {
    if (newMapKey) setSearchParams({ map_key: newMapKey });
  };

  const handleVisibilityFactionsChange = async (newFactions: string[]) => {
    if (!committeeId || !mapKey) return;

    try {
      await updateVisibilityFactions(committeeId, mapKey, newFactions);
    } catch (error) {
      console.error('Failed to update visibility factions:', error);
      // You might want to add toast notification here
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Navigate to home or login page after logout
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Only show visibility controls to staff members
  const canEditVisibility = accessLevel === 'staff';

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        <Flex gap="sm">
          <Select
            value={mapKey}
            onChange={handleMapChange}
            data={availableMaps.map((map) => ({ value: map, label: map }))}
            style={{ minWidth: 200 }}
            label="Select Map"
          />

          {canEditVisibility && (
            <div>
              <Text size="sm" fw={500} mb={5}>
                Map Visibility
              </Text>
              <MultiSelect
                value={mapMeta.visibilityFactions || []}
                onChange={handleVisibilityFactionsChange}
                data={allFactions.map((faction) => ({
                  value: faction,
                  label: faction,
                }))}
                placeholder="Select factions that can see this map"
                searchable
                clearable
                style={{ minWidth: 250 }}
                description="Leave empty to make visible to everyone"
              />
            </div>
          )}
        </Flex>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Menu shadow="md" width={250}>
          <Menu.Target>
            <Avatar
              style={{ cursor: 'pointer' }}
              src={sessionUser?.photoURL}
              alt={sessionUser?.displayName || sessionUser?.email || 'User'}
            />
          </Menu.Target>

          <Menu.Dropdown>
            {sessionUser?.displayName && (
              <Menu.Item disabled>
                <Text size="sm" fw={500}>
                  {sessionUser.displayName}
                </Text>
              </Menu.Item>
            )}
            {sessionUser?.email && (
              <Menu.Item disabled>
                <Text size="xs" c="dimmed">
                  {sessionUser.email}
                </Text>
              </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item leftSection={<IconLogout size={14} />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>

      <MapView />
    </div>
  );

};
