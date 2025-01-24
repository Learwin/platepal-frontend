import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import styles from '../Layout.module.css';
import HintergrundBild from '../assets/images/Hintergrund.png';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Footer from '../components/Footer';
import Startseite from './Startseite';
import SearchRecipe from './SearchRecipe';
import RezeptDetails from './RezeptDetails';

const Layout: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Funktion, um den Suchbegriff zu setzen
  const handleSearchChange = (term: string) => {
    setSearchTerm(term.trim());

    // Nur navigieren, wenn nicht bereits auf der Hauptseite
    if (term.trim() === '') {
      navigate('/'); // Zur Startseite zurückkehren
    }
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Navbar */}
      <Navbar />

      {/* Hintergrundbild */}
      <div className={styles.backgroundImage}>
        <img className="Background" src={HintergrundBild} alt="Hintergrundbild" />
      </div>

      {/* Wrapper für Inhalt */}
      <div className={styles.wrapper}>
        {/* Suchleiste */}
        <div className={styles.searchContainer}>
          <Search onSearchChange={handleSearchChange} />
        </div>

        {/* Routes für Inhalte */}
        <Routes>
          {/* Startseite oder Suchergebnisse */}
          <Route
            path="/"
            element={
              searchTerm === '' ? <Startseite /> : <SearchRecipe searchTerm={searchTerm} />
            }
          />

          {/* Rezeptdetails */}
          <Route path="/rezept/:id" element={<RezeptDetails />} />

          {/* Fallback für ungültige Routen */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
