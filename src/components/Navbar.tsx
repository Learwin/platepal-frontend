import React from 'react';
import styles from "../Startseite.module.css";
import { useNavigate } from "react-router-dom";
import LogoBild from '../assets/images/Logo.png';  // Beispiel für das Logo-Bild

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate("/login"); // Navigiert zur Anmeldeseite
    console.log("test");
  };

  return (
    <div className={styles.header}>
      <div className={styles.rectangle5}></div>
      <div className={styles.frame29}>
        <div className={styles.sponsoring2}>Sponsoring</div>
        <div className={styles.magazin2}>Magazin</div>
        <div className={styles.berUns}>Über Uns</div>
        <button onClick={handleClick} className={styles.anmeldeButton}>
          Anmelden
        </button>
      </div>
      <img className={styles.logo} src={LogoBild} alt="Logobild" />
    </div>
  );
};

export default Navbar;
