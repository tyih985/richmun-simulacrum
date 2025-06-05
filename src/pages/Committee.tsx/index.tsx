import { useCommitteeAccess } from '@hooks/useCommitteeAccess';
import { Routes, Route, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Stack, Button, Center, Title, Select } from '@mantine/core';
import { COMMITTEE_DATA_MAP } from '@lib/mapPrototypeKeys';
import { IconArrowRight } from '@tabler/icons-react';
import { useEffect } from 'react';
import { MapView } from './MapView';

export const CommitteeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CommitteeSelectPage />} />
      <Route path="/:committeeId" element={<CommitteeContentPage />} />
    </Routes>
  );
};

const CommitteeSelectPage = () => {
  const { availableCommittees, setSelectedCommittee } = useCommitteeAccess();
  const navigate = useNavigate();

  const handleCommitteeSelect = (committeeId: string) => {
    setSelectedCommittee(committeeId);
    navigate(`/c/${committeeId}`);
  };

  return (
    <Center style={{ height: '100vh' }}>
      <Stack gap="xs">
        <Title order={2}>Select a Committee</Title>
        {availableCommittees?.map((committeeId) => (
          <Button
            key={committeeId}
            variant="subtle"
            rightSection={<IconArrowRight />}
            onClick={() => handleCommitteeSelect(committeeId)}
          >
            {COMMITTEE_DATA_MAP[committeeId]?.name}
          </Button>
        ))}
      </Stack>
    </Center>
  );
};

const CommitteeContentPage = () => {
  const { committeeId } = useParams();
  const { availableCommittees, availableMaps, setSelectedCommittee } =
    useCommitteeAccess();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const mapKey = searchParams.get('map_key');

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

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* Map selector overlay */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Select
          label="Select Map"
          value={mapKey}
          onChange={handleMapChange}
          data={availableMaps.map((map) => ({ value: map, label: map }))}
          style={{ minWidth: 200 }}
        />
      </div>

      {/* Map View Component */}
      <MapView />
    </div>
  );
};
