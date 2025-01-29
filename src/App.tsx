import React, { useState } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Startseite from './pages/Startseite';
import Anmeldung from './pages/Anmeldung';
import Register from './pages/Register';
import Profil from './pages/Profil';
import { AuthProvider, useAuth } from './context/AuthContextType';
import RezeptDetails from './pages/RezeptDetails';
import { CartProvider } from './context/CartContext';
import { CheckedProvider } from './context/CheckedContext';
import SearchRecipe from './pages/SearchRecipe';
import KategorieRezepte from './pages/KatergorieRezept';

function App() {
  const [searchTerm, setSearchTerm] = useState<string>(''); // searchTerm verwalten
  const { allergenId } = useParams();
  console.log(allergenId);

  return (
    <AuthProvider>
      <CartProvider>
        <CheckedProvider>
          <Routes>
          <Route path="/" element={<Layout />}> {/* searchTerm an Layout weitergeben */}
              <Route index element={<Startseite />} /> {/* searchTerm an Startseite weitergeben */}
              <Route path="home" element={<Startseite />} />
              <Route path="/search/:searchTerm" element={<SearchRecipe />} />
              <Route path="/kategorie/:categoryName" element={<KategorieRezepte />} />

              <Route path="/rezept/:rezeptId" element={<RezeptDetails />} />
              <Route path="profil" element={<PrivateRoute><Profil /></PrivateRoute>} />

            </Route>
            <Route path="/login" element={<Anmeldung />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </CheckedProvider>
      </CartProvider>
    </AuthProvider>
    //Routung fixen
    //Bilder fixen.
    //danach fertig
  );
}

export default App;


const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isLoggedIn } = useAuth(); // Hole den Login-Status

  if (!isLoggedIn) {
    return <Navigate to="/login" />; // Weiterleitung zur Login-Seite, wenn nicht eingeloggt
  }

  return children; // Zeige die Kinder (Profil) nur, wenn der Benutzer eingeloggt ist
};
