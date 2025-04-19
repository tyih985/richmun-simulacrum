import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './Login';
import { Debugger } from './Debugger';
import { useSession } from '@hooks/useSession';
import { SimulationDirectory } from './SimulationDirectory';
import { ApplicationShell } from './app';

export const RootRoutes = () => {
  const { isChecking, isLoggedIn } = useSession();

  if (isChecking)
    return (
      <Routes>
        {stableAccessRoutes}
        <Route path="/*" element={<div>Connecting...</div>} />
      </Routes>
    );

  if (isLoggedIn)
    return (
      <Routes>
        <Route path="/sim" element={<SimulationDirectory />} />
        <Route path="/app/*" element={<ApplicationShell />} />
        {stableAccessRoutes}
        <Route path="/*" element={<Navigate to="/sim" />} />
      </Routes>
    );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {stableAccessRoutes}
      <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

// need to add a branding page
const stableAccessRoutes = (
  <>
    <Route path="/debugger" element={<Debugger />} />
    <Route path="/branding" element={<Debugger />} />
  </>
);
