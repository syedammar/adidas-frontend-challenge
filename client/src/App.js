import React from 'react';
import './App.css';
import Routes from './util/routes';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  return (
    <React.Suspense fallback={<>...</>}>
      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>
    </React.Suspense>    
  );
}

export default App;
