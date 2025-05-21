import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import { Debugger } from './Debugger';
import { useSession } from '@hooks/useSession';
import { SimulationDirectory } from './SimulationDirectory';
import { ApplicationShell } from './app';
import { Loader } from '@mantine/core';
import AuthLayout from './AuthLayout';
import { Branding } from './Branding';
import { Eula } from './Eula';

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
        <Route path="/sim" element={<SimulationDirectory />} />
        <Route path="/app/*" element={<ApplicationShell />} />
        {stableAccessRoutes}
        <Route path="/*" element={<Navigate to="/sim" />} />
      </Routes>
    );

  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="/eula" element={<Eula />}/>
      {stableAccessRoutes}
      <Route path="/*" element={<Navigate to="/login" />} />
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
