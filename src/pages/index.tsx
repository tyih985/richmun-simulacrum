import { Navigate, Route, Routes } from 'react-router-dom';
import { Debugger } from './Debugger';
import { useSession } from '@hooks/useSession';
import { Loader } from '@mantine/core';
import { Branding } from './Branding';
import { Mock } from './SetupFlow/Setup.tsx';
import { AuthRoutes } from './Auth';
import { CommitteeRoutes } from './Committee.tsx';

export const RootRoutes = () => {
  const { isChecking, isLoggedIn } = useSession();

  if (isChecking)
    return (
      <Routes>
        {stableAccessRoutes}
        <Route
          path="/*"
          element={
            <Loader
              variant="dots"
              size="lg"
              color="blue"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          }
        />
      </Routes>
    );

  if (isLoggedIn)
    return (
      <Routes>
        {stableAccessRoutes}
        <Route path="/c/*" element={<CommitteeRoutes />} />
        <Route path="/*" element={<Navigate to="/c" />} />
      </Routes>
    );

  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      {stableAccessRoutes}
      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};

// need to add a branding page
const stableAccessRoutes = (
  <>
    <Route path="/debugger" element={<Debugger />} />
    <Route path="/branding" element={<Branding />} />
    <Route path="/mock" element={<Mock />} />
  </>
);
