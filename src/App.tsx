import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Startseite from './pages/Startseite';
import Anmeldung from './pages/Anmeldung';
import Register from './pages/Register';
import Profil from './pages/Profil';
import { AuthProvider } from './context/AuthContextType';

function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Startseite />} />
        <Route path="home" element={<Startseite />} />
        <Route path="profil"  />
      </Route>
      <Route path="/login" element={<Anmeldung />} />
      <Route path="/register" element={<Register />} />
      <Route path="profil" element={<Profil />} />
    </Routes>
    </AuthProvider>
  );
}

export default App;
