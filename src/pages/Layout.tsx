import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from '../Layout.module.css';
import HintergrundBild from '../assets/images/Hintergrund.png';
import Profil from './Profil';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContextType';

const Layout: React.FC = () => {
    const { isLoggedIn } = useAuth(); // Hier verwenden Sie den Zustand aus dem Context
    
    return (
        <div className={styles.layoutContainer}>
            <Navbar />
            <div className={styles.backgroundImage}> 
                <img className="Background" src={HintergrundBild} alt="Hintergrundbild" />
            </div>
            <div className={styles.contentWrapper}>
                {isLoggedIn ? <Profil /> : <Outlet />}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
