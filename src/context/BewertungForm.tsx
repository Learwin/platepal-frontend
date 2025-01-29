import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { postBewertung } from '../services/api';
import { Star } from 'lucide-react';
import styles from '../RezeptDetails.module.css';

interface BewertungFormProps {
  rezeptId: number;
  userId: number;
}

const BewertungForm: React.FC<BewertungFormProps> = ({ rezeptId, userId }) => {
  const [bewertung, setBewertung] = useState<number>(0); // Aktuelle Bewertung des Benutzers
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); // Snackbar Zustand
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false); // Snackbar Zustand
  const [alertMessage, setAlertMessage] = useState<string>(''); // Nachricht für Snackbar


  const handleStarClick = (rating: number) => {
    setBewertung(rating);
  };

  const handleSubmitBewertung = async () => {
    try {
      const foto = ''; // Optionales Foto
      const bewertungData = {
        anzahl_Sterne: bewertung,
        foto: foto,
        rezept_id: { id: rezeptId },
        user_Id: { id: userId },
      };

      const savedBewertung = await postBewertung(bewertungData);
      console.log('Bewertung erfolgreich gespeichert:', savedBewertung);

      // Snackbar nach Bewertung anzeigen
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Fehler beim Absenden der Bewertung:', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6">Bewerte dieses Rezept:</Typography>
      <Box display="flex" alignItems="center" marginTop={2}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={30}
            onClick={() => handleStarClick(star)}
            style={{ color: bewertung >= star ? '#E7B84B' : 'gray', cursor: 'pointer' }}
          />
        ))}
      </Box>
      <Button onClick={handleSubmitBewertung} className={styles.bewertungButton} >
        Bewertung absenden
      </Button>

      {/* Snackbar für Bestätigung */}
      <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert onClose={() => setOpenSnackbar(false)} severity={alertMessage.includes('Fehler') ? 'error' : 'success'}>
                {alertMessage}
              </Alert>
            </Snackbar>
    </Box>
  );
};

export default BewertungForm;
