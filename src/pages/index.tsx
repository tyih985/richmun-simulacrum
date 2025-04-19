import { Navigate, Route, Routes } from 'react-router-dom';
import Homepage from './debugger';
import BrandingPage from './branding';
import { SummaryPage } from './summary';
import { Login } from './login';

export const RootRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<SummaryPage/>}/>
      <Route path="/debugger" element={<Homepage />} />
      <Route path="/branding" element={<BrandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path='/*' element={<Navigate to='/'/>}/>
    </Routes>
  );
};
