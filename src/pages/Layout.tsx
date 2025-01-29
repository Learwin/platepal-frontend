import React from 'react';
import styles from '../Layout.module.css';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Layout: React.FC = () => {
  const navigate = useNavigate();

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
      <div className={styles.backgroundImage}></div>
      <div className={styles.contentWrapper}>
        <div className={styles.searchContainer}>
          <Search onSearchChange={handleSearchChange} />
        </div>
        <Outlet /> {/* Immer alle Kindrouten rendern */}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
