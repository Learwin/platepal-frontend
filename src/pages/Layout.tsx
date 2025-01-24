import React, { useState } from 'react';
import styles from '../Layout.module.css';
import HintergrundBild from '../assets/images/Hintergrund.png';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Footer from '../components/Footer';
import Startseite from './Startseite';
import Profil from './Profil';
import { useAuth } from '../context/AuthContextType';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [hasSeenStartseite, setHasSeenStartseite] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn && !hasSeenStartseite) {
      setHasSeenStartseite(true);
    }
  }, [isLoggedIn, hasSeenStartseite]);

  const handleSearchChange = (term: string) => {
    const trimmedTerm = term.trim();
    if (trimmedTerm) {
      navigate(`/search/${encodeURIComponent(trimmedTerm)}`);
    } else {
      navigate('/'); // Leere Suche, zurück zur Startseite
    }
  };

  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <div className={styles.backgroundImage}>
        <img className="Background" src={HintergrundBild} alt="Hintergrundbild" />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.searchContainer}>
          <Search onSearchChange={handleSearchChange} />
        </div>
        {isLoggedIn ? (
          hasSeenStartseite ? <Startseite /> : <Profil />
        ) : (
          <Outlet />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
