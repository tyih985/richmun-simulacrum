import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import { Eula } from './Eula';
import AuthLayout from './AuthLayout';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="eula" element={<Eula />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
};
