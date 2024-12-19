import React, { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import styles from '../Verwaltung.module.css'; // CSS-Module verwenden

const Verwaltung: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <div className={styles.verwaltungContainer}>
            <Tabs
                value={activeTab}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
                className={styles.tabs}
            >
                <Tab label="Profil" className={styles.tab} />
                <Tab label="Rezepturverwaltung" className={styles.tab} />
                <Tab label="Zutatenverwaltung" className={styles.tab} />
                <Tab label="Zutat der Woche" className={styles.tab} /> {/* Admin-spezifischer Tab */}
            </Tabs>
            <div className={styles.tabContent}>
                {activeTab === 0 && <div>Profil-Inhalte</div>}
                {activeTab === 1 && <div>Rezepturverwaltung-Inhalte</div>}
                {activeTab === 2 && <div>Zutatenverwaltung-Inhalte</div>}
                {activeTab === 3 && <div>Zutat der Woche-Inhalte (Nur Admins)</div>}
            </div>
        </div>
    );
};

export default Verwaltung;
