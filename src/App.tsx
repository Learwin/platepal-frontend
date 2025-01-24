import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Startseite from './pages/Startseite';
import Anmeldung from './pages/Anmeldung';
import Register from './pages/Register';
import Profil from './pages/Profil';
import { AuthProvider } from './context/AuthContextType';
import RezeptDetails from './pages/RezeptDetails';
import { CartProvider } from './context/CartContext';
import { CheckedProvider } from './context/CheckedContext';

function App() {
  const [searchTerm, setSearchTerm] = useState<string>(''); // searchTerm verwalten

  return (
    <AuthProvider>
      <CartProvider>
        <CheckedProvider>
          <Routes>
          <Route path="/" element={<Layout />}> {/* searchTerm an Layout weitergeben */}
              <Route index element={<Startseite />} /> {/* searchTerm an Startseite weitergeben */}
              <Route path="home" element={<Startseite />} />
              
              <Route path="/rezept/:rezeptId" element={<RezeptDetails />} />
              <Route path="profil" element={<Profil />} />
            </Route>
            <Route path="/login" element={<Anmeldung />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </CheckedProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
