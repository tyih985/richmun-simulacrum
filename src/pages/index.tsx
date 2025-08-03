import { Navigate, Route, Routes } from 'react-router-dom';
import { Debugger } from './Debugger';
import { useSession } from '@hooks/useSession';
import { Loader } from '@mantine/core';
import { Branding } from './Branding';
import { Setup } from './SetupFlow/Setup.tsx';
import { AuthRoutes } from './Auth';
import { CommitteeRoutes } from './Committee.tsx';
import { Caucus } from './Caucus';
import { Dashboard } from './Dashboard';
import { CommitteeDash } from './CommitteeDash';
import { DirectiveHistory } from './DirectiveHistory';
import { DirectiveInbox } from './DirectiveInbox';
import { MakeDirective } from './MakeDirective';
import { Motions } from './Motions';
import { RollCall } from './RollCall';
import { RollCallList } from './RollCallList';
import { Speakers } from './Speakers.tsx';
import { CommitteeAppShell } from '@components/AppShell';
import { JSX } from 'react';

const ProtectedRoute = ({
  allowedRoles,
  userRole,
  element,
}: {
  allowedRoles: string[];
  userRole: string;
  element: JSX.Element;
}) => {
  return allowedRoles.includes(userRole) ? element : <Navigate to="/unauthorized" />;
};

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
        <Route path="/setup" element={<Setup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/committee/:committeeId" element={<CommitteeAppShell />}>
          <Route index element={<CommitteeDash />} />
          <Route path="dashboard" element={<CommitteeDash />} />
          <Route path="speakers" element={<Speakers />} />
          <Route path="directives/history" element={<DirectiveHistory />} />
          <Route path="directives" element={<DirectiveInbox />} />
          <Route path="directives/new" element={<MakeDirective />} />
          <Route path="motions" element={<Motions />} />
          <Route path="caucus/:motionId" element={<Caucus />} />
          <Route path="rollcall/list" element={<RollCallList />} />
          <Route path="rollcall/:rollCallId" element={<RollCall />} />
        </Route>
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
  </>
);
