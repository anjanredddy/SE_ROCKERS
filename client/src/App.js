import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import BorrowersList from './components/borrowers/BorrowersList';
import LoansList from './components/loans/LoansList';
import PaymentsList from './components/payments/PaymentsList';
import LoanReport from './components/reports/LoanReport';
import PaymentReport from './components/reports/PaymentReport';
import UserManagement from './components/users/UserManagement';
import Profile from './components/profile/Profile';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="borrowers" element={<BorrowersList />} />
                        <Route path="loans" element={<LoansList />} />
                        <Route path="payments" element={<PaymentsList />} />
                        <Route path="reports">
                          <Route path="loans" element={<LoanReport />} />
                          <Route path="payments" element={<PaymentReport />} />
                        </Route>
                        <Route
                          path="users"
                          element={
                            <AdminRoute>
                              <UserManagement />
                            </AdminRoute>
                          }
                        />
                        <Route path="profile" element={<Profile />} />
                      </Routes>
                    </MainLayout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
