import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from '../Profil.module.css';
import Zutatenverwaltung from './Zutatenverwaltung';
import ZutatDerWoche from './ZutatDerWoche';
import { useAuth } from '../context/AuthContextType';
import { getUserImageById, User, uploadUserImage, putUser } from '../services/api';
import Rezepturverwaltung from './Rezepturverwaltung';

const Profil: React.FC = () => {
    const { user, isLoggedIn, setUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<number>(0);
    const [profileImage, setProfileImage] = useState<string>('https://via.placeholder.com/150');
    const [username, setUsername] = useState<string>(user?.username || '');
    const [emailAdresse, setEmail] = useState<string>(user?.emailAdresse || '');
    const [passwort, setPassword] = useState<string>(user?.passwort || '');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const { imageUrl } = await getUserImageById(user.id);
                    setProfileImage(imageUrl); // Bild als URL setzen
                } catch (error) {
                    console.error('Fehler beim Abrufen des Profils:', error);
                }
            };
            fetchUserData();
        }
    }, [user]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSave = async () => {
    if (!user || user.id === 0) {
        setAlertMessage('Es kann nur ein bestehender Benutzer bearbeitet werden.');
        setOpenSnackbar(true);
        return;
    }

    try {
        const updatedUser: User = {
            ...user,
            username: username.trim(),
            emailAdresse: emailAdresse.trim(),
            passwort: passwort.trim(),
            //foto: profileImage || '',
        };

        console.log('Zu aktualisierender Benutzer:', updatedUser);

        const updatedUserFromServer = await putUser(updatedUser);

        if (!updatedUserFromServer || !updatedUserFromServer.id) {
            console.error('Server hat keine gültigen Benutzerdaten zurückgegeben:', updatedUserFromServer);
            setAlertMessage('Fehler: Ungültige Serverantwort.');
            setOpenSnackbar(true);
            return;
        }

        console.log('Serverantwort:', updatedUserFromServer);

        setUser(updatedUserFromServer);
        console.log('Benutzerkontext erfolgreich aktualisiert.');

        setAlertMessage('Profil erfolgreich gespeichert!');
        setOpenSnackbar(true);
    } catch (error) {
        console.error('Fehler beim Speichern des Profils:', error);
        setAlertMessage('Fehler beim Speichern des Profils. Bitte versuche es erneut.');
        setOpenSnackbar(true);
    }
};

    
const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
        setAlertMessage('Keine Datei ausgewählt.');
        setOpenSnackbar(true);
        return;
    }

    if (!user) {
        setAlertMessage('Benutzer nicht gefunden.');
        setOpenSnackbar(true);
        return;
    }

    console.log('Hochgeladene Datei:', file);

    try {
        // Schritt 1: Bildvorschau setzen
        const imagePreviewUrl = URL.createObjectURL(file);
        setProfileImage(imagePreviewUrl);

        // Schritt 2: Bild hochladen
        await uploadUserImage(user.id, file);

        // Schritt 3: Benutzerprofil aktualisieren mit statischem Pfad
        const updatedUser: User = {
            ...user,
            foto: `./images/user/${file.name}`, 
        };

        setUser(updatedUser); // Lokale Benutzerdaten aktualisieren

        setAlertMessage('Bild erfolgreich hochgeladen und Profil aktualisiert.');
        setOpenSnackbar(true);
    } catch (error) {
        console.error('Fehler beim Bild-Upload:', error);
        setAlertMessage('Fehler beim Hochladen des Bildes.');
        setOpenSnackbar(true);
    }
};


    
    return (
        <div className={styles.profilContainer}>
            <Box>
                <Tabs value={activeTab} onChange={handleChange} centered className={styles.tabs}>
                    <Tab label="Profil" className={styles.tab} />
                    <Tab label="Rezepturverwaltung" className={styles.tab} />
                    <Tab label="Zutatenverwaltung" className={styles.tab} />
                    <Tab label="Zutat der Woche" className={styles.tab} />
                </Tabs>
                <Box className={styles.tabContent}>
                    {activeTab === 0 && (
                        <div className={styles.profilContent}>
                            <div className={styles.imageSection}>
                                <img src={profileImage} alt="Profilbild" className={styles.profileImage} />
                                <Button variant="contained" component="label" className={styles.uploadButton}>
                                    Bild hochladen
                                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                </Button>
                            </div>
                            <TextField
                                label="Benutzername"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                fullWidth
                                className={styles.textField}
                            />
                            <TextField
                                label="E-Mail-Adresse"
                                variant="outlined"
                                value={emailAdresse}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                className={styles.textField}
                            />
                            <TextField
                                label="Passwort"
                                variant="outlined"
                                type="password"
                                value={passwort}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                className={styles.textField}
                            />
                            <Button variant="contained" className={styles.saveButton} onClick={handleSave}>
                                Speichern
                            </Button>
                        </div>
                    )}
                    {activeTab === 1 && <Rezepturverwaltung />}
                    {activeTab === 2 && <Zutatenverwaltung />}
                    {activeTab === 3 && <ZutatDerWoche />}
                </Box>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={alertMessage.startsWith('Fehler') ? 'error' : 'success'}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Profil;
