import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { renderRoutes } from './routes';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          {renderRoutes()}
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
