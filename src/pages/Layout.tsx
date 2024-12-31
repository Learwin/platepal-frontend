import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../Layout.module.css';
import HintergrundBild from '../assets/images/Hintergrund.png';
import Profil from './Profil';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContextType';
import Search from '../components/Search';
import Footer from '../components/Footer';

const Layout: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <div className={styles.backgroundImage}>
        <img className="Background" src={HintergrundBild} alt="Hintergrundbild" />
      </div>
      <div className={styles.contentWrapper}>
        <Search />
        {isLoggedIn ? <Profil /> : <Outlet />}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
