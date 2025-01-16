import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../Layout.module.css';
import HintergrundBild from '../assets/images/Hintergrund.png';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Footer from '../components/Footer';

const Layout: React.FC = () => {

  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <div className={styles.backgroundImage}>
        <img className="Background" src={HintergrundBild} alt="Hintergrundbild" />
      </div>
      <div className={styles.contentWrapper}>
        <Search />
        <Outlet /> {/* Hier wird die aktuelle Komponente je nach Route gerendert */}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
