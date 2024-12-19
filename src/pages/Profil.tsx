import React, { useState } from 'react';
import { Tab, Tabs, Box, TextField, Button } from '@mui/material';
import styles from '../Profil.module.css';

const Profil: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [profileImage, setProfileImage] = useState<string>('https://via.placeholder.com/150');
    const [firstName, setFirstName] = useState<string>('Max');
    const [lastName, setLastName] = useState<string>('Mustermann');
    const [alter, setAlter] = useState<string>('Alter');

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) setProfileImage(e.target.result as string);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleSave = () => {
        // Hier können die Daten gespeichert werden.
        console.log('Speichern Button gedrückt');
        // Implementiere weitere Logik zum Speichern der Daten
    };

    return (
        <div className={styles.profilContainer}>
            <Box>
                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={handleChange}
                    centered
                    className={styles.tabs}
                >
                    <Tab label="Profil" className={styles.tab} />
                    <Tab label="Rezepturverwaltung" className={styles.tab} />
                    <Tab label="Zutatenverwaltung" className={styles.tab} />
                    <Tab label="Zutat der Woche" className={styles.tab} />
                </Tabs>

                {/* Tab Inhalte */}
                <Box className={styles.tabContent}>
                    {activeTab === 0 && (
                        <div className={styles.profilContent}>
                            <div className={styles.imageSection}>
                                <img
                                    src={profileImage}
                                    alt="Profilbild"
                                    className={styles.profileImage}
                                />
                                <Button
                                    variant="contained"
                                    component="label"
                                    className={styles.uploadButton}
                                >
                                    Bild hochladen
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </Button>
                            </div>
                            <TextField
                                label="Vorname"
                                variant="outlined"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                fullWidth
                                className={styles.textField}
                            />
                            <TextField
                                label="Nachname"
                                variant="outlined"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                fullWidth
                                className={styles.textField}
                            />
                            <TextField
                                label="Alter"
                                variant="outlined"
                                value={alter}
                                onChange={(e) => setAlter(e.target.value)}
                                fullWidth
                                className={styles.textField}
                            />
                            <Button
                                variant="contained"
                                className={styles.saveButton}
                                onClick={handleSave}
                            >
                                Speichern
                            </Button>
                        </div>
                    )}
                    {activeTab === 1 && <div>Rezepturverwaltung-Inhalte</div>}
                    {activeTab === 2 && <div>Zutatenverwaltung-Inhalte</div>}
                    {activeTab === 3 && <div>Zutat der Woche-Inhalte</div>}
                </Box>
            </Box>
        </div>
    );
};

export default Profil;
