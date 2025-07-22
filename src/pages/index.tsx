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
import { Speakers } from './Speakers.tsx';

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
        <Route path="/committee/:committeeId/speakers" element={<Speakers />} />
        <Route path="/committee/:committeeId/dashboard" element={<CommitteeDash />} />
        <Route
          path="/committee/:committeeId/directive/history"
          element={<DirectiveHistory />}
        />
        <Route path="/committee/:committeeId/directives" element={<DirectiveInbox />} />
        <Route
          path="/committee/:committeeId/directive/make"
          element={<MakeDirective />}
        />
        <Route path="/committee/:committeeId/motions" element={<Motions />} />
        <Route path="/committee/:committeeId/caucus/:motionId" element={<Caucus />} />

       <Route path="/committee/:committeeId/rollcall" element={<RollCall />} />

       <Route
         path="/committee/:committeeId/rollcall/:rollCallId"
         element={<RollCall />}
       />
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
