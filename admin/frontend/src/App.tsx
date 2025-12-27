import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';

// Lazy load feature components for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserList = lazy(() => import('./features/user/UserList'));
const RoleList = lazy(() => import('./features/role/RoleList'));
const ProductList = lazy(() => import('./features/product/ProductList'));
const OrderCreate = lazy(() => import('./features/order/OrderCreate'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <Spin size="large" />
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="users"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <UserList />
                  </Suspense>
                }
              />
              <Route
                path="roles"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RoleList />
                  </Suspense>
                }
              />
              <Route
                path="products"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProductList />
                  </Suspense>
                }
              />
              <Route
                path="orders"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <OrderCreate />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
