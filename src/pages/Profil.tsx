import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from '../Profil.module.css';
import ZutatDerWoche from './ZutatDerWoche';
import { useAuth } from '../context/AuthContextType';
import { getUserImageById, User, uploadUserImage, putUser } from '../services/api';
import Rezepturverwaltung from './Rezepturverwaltung';
import Zutatenverwaltung from './Zutatenverwaltung';
import defaultImage from '../assets/images/bild.png';

const Profil: React.FC = () => {
    const { user, isLoggedIn, setUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<number>(0);
    const [profileImage, setProfileImage] = useState<string>(defaultImage);
    const [username, setUsername] = useState<string>(user?.username || '');
    const [emailAdresse, setEmail] = useState<string>(user?.emailAdresse || '');
    const [passwort, setPassword] = useState<string>(user?.passwort || '');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

    // Zustand für flag definieren
    const [flag, setFlag] = useState<number>(user?.flag || 0); // Setze den Standardwert auf 0, falls kein Wert vorhanden ist

    const isAdmin = flag === 1; // Überprüfe, ob der Benutzer ein Admin ist (flag === 1)

    // Navigiert den Benutzer zur Login-Seite, wenn er nicht eingeloggt ist
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    // Holt das Profilbild des Benutzers nach dem Laden der Benutzerdaten
    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const { imageUrl } = await getUserImageById(user.id);
                    setProfileImage(imageUrl); // Bild als URL setzen
                    setFlag(user.flag || 0);  // Flag aus den Benutzerdaten setzen, Standardwert 0
                } catch (error) {
                    console.error('Fehler beim Abrufen des Profils:', error);
                }
            };
            fetchUserData();
        }
    }, [user]);

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
                flag: flag,  // Setze den flag-Wert hier als number
            };

            const updatedUserFromServer = await putUser(updatedUser);

            if (!updatedUserFromServer || !updatedUserFromServer.id) {
                setAlertMessage('Fehler: Ungültige Serverantwort.');
                setOpenSnackbar(true);
                return;
            }

            setUser(updatedUserFromServer);

            setAlertMessage('Profil erfolgreich gespeichert!');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Fehler beim Speichern des Profils:', error);
            setAlertMessage('Fehler beim Speichern des Profils. Bitte versuche es erneut.');
            setOpenSnackbar(true);
        }
    };

    // Verarbeitet das Hochladen eines neuen Profilbildes
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

        try {
            const imagePreviewUrl = URL.createObjectURL(file);
            setProfileImage(imagePreviewUrl);

            await uploadUserImage(user.id, file);

            const updatedUser: User = {
                ...user,
                foto: `./images/user/${file.name}`,
            };

            setUser(updatedUser);

            setAlertMessage('Bild erfolgreich hochgeladen und Profil aktualisiert.');
            setOpenSnackbar(true);
        } catch (error) {
            setAlertMessage('Fehler beim Hochladen des Bildes.');
            setOpenSnackbar(true);
        }
    };

    // Funktion zum Wechseln des aktiven Tabs
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <div className={styles.profilContainer}>
            <Box>
                <Tabs
                    value={activeTab}
                    onChange={handleChange}
                    centered
                    className={styles.tabs}
                >
                    <Tab label="Profil" className={styles.tab} />
                    <Tab label="Rezepturverwaltung" className={styles.tab} />
                    {isAdmin && <Tab label="Zutatenverwaltung" className={styles.tab} />}
                    {isAdmin && <Tab label="Zutat der Woche" className={styles.tab} />}
                </Tabs>

                <Box className={styles.tabContent}>
                    {activeTab === 0 && (
                        <div className={styles.profilContent}>
                            <div className={styles.imageSection}>
                                <img src={profileImage || defaultImage} alt="Profilbild" className={styles.profileImage} />
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
                    {activeTab === 2 && isAdmin && <Zutatenverwaltung />}
                    {activeTab === 3 && isAdmin && <ZutatDerWoche />}
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
