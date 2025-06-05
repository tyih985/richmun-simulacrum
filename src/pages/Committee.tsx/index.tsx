import { useCommitteeAccess } from '@hooks/useCommitteeAccess';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Stack, Button, Center, Title } from '@mantine/core';
import { COMMITTEE_DATA_MAP } from '@lib/mapPrototypeKeys';
import { IconArrowRight } from '@tabler/icons-react';
import { useEffect } from 'react';

export const CommitteeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CommitteeSelectPage />} />
      <Route path="/:committeeId" element={<CommitteeContentPage />} />
    </Routes>
  );
};

const CommitteeSelectPage = () => {
  const { availableCommittees } = useCommitteeAccess();
  const navigate = useNavigate();

  const handleCommitteeSelect = (committeeId: string) => {
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
            rightSection={<IconArrowRight/>}
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
  const { availableCommittees } = useCommitteeAccess();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if committeeId is missing or not in available committees
    if (!committeeId || !availableCommittees.includes(committeeId)) {
      navigate('/c/', { replace: true });
    }
  }, [committeeId, availableCommittees, navigate]);

  // Don't render content if validation fails
  if (!committeeId || !availableCommittees.includes(committeeId)) {
    return null;
  }

  return (
    <div>
      <h1>Committee: {committeeId}</h1>
      {/* Your specific committee content here 
        * probably need to update the map component to allow for dynamic map key selection
      */}
    </div>
  );
};
