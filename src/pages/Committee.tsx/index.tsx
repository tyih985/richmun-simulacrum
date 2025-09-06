import { useCommitteeAccess } from '@hooks/useCommitteeAccess';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Stack, Button, Center, Title } from '@mantine/core';
import { COMMITTEE_DATA_MAP } from '@lib/mapPrototypeKeys';
import { IconArrowRight } from '@tabler/icons-react';

import { MapPage } from './MapPage';

export const CommitteeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CommitteeSelectPage />} />
      <Route path="/:committeeId" element={<MapPage />} />
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
