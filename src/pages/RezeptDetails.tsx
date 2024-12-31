import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { fetchRezeptDetails, fetchRezeptByIdImage } from '../services/api';
import styles from '../RezeptDetails.module.css'; // Importiere das CSS-Modul

const RezeptDetails: React.FC = () => {
  const { rezeptId } = useParams<{ rezeptId: string }>(); // Rezept-ID aus der URL holen
  const [rezept, setRezept] = useState<any>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [checkedZutaten, setCheckedZutaten] = useState<Set<number>>(new Set());
  const [imageUrl, setImageUrl] = useState<string>(''); // Zustand für das Bild

  useEffect(() => {
    if (rezeptId) {
      // Hole die Rezeptdetails basierend auf der ID
      fetchRezeptDetails(Number(rezeptId)) // Den rezeptId aus der URL hier übergeben
        .then((data) => {
          if (data) {
            setRezept(data);
            setRemainingTime(data.zeit); // Die Zeit setzen
          }
        })
        .catch((error) => {
          console.error('Fehler beim Laden des Rezepts:', error);
        });

      // Hole das Rezeptbild basierend auf der ID
      fetchRezeptByIdImage(Number(rezeptId))
        .then((data) => {
          setImageUrl(data.imageUrl); // Setze das Bild
        })
        .catch((error) => {
          console.error('Fehler beim Laden des Bildes:', error);
        });
    }
  }, [rezeptId]);

  const handleZutatChange = (zutatId: number) => {
    setCheckedZutaten((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(zutatId)) {
        newChecked.delete(zutatId);
      } else {
        newChecked.add(zutatId);
      }
      return newChecked;
    });
  };

  if (!rezept) {
    return <div>Loading...</div>;
  }

  return (
    <Box className={styles.container}>
      <Grid container spacing={2}>
        {/* Grid für Bild und Zutaten nebeneinander */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ width: '100%' }}>
            <CardMedia
              component="img"
              alt={rezept.name}
              height="200"
              image={imageUrl || rezept.foto} // Verwende das abgerufene Bild, oder das Standardbild aus den Rezeptdetails
              className={styles.cardImage}
            />
            <Box display="flex" justifyContent="center" padding={2}>
              <Button
                variant="contained"
                color="primary"
                className={styles.cardButton}
                onClick={() => setRemainingTime(rezept.zeit)} // Setzt die Zeit zurück, wenn der Button gedrückt wird
              >
                Kochzeit: {remainingTime} Minuten
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ width: '100%' }} className={styles.cardContent}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Zutaten</Typography>
              {rezept.zutaten && Array.isArray(rezept.zutaten) ? (
                rezept.zutaten.map((zutat: any) => (
                  <FormControlLabel
                    key={zutat.id}
                    control={
                      <Checkbox
                        checked={checkedZutaten.has(zutat.id)}
                        onChange={() => handleZutatChange(zutat.id)}
                        name={zutat.name}
                      />
                    }
                    label={zutat.name}
                  />
                ))
              ) : (
                <Typography variant="body2">Keine Zutaten verfügbar</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Card für Anweisungen unter den anderen Cards */}
      <Card sx={{ marginTop: 2, width: '100%' }} className={styles.cardContent}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Anweisungen</Typography>
          <Typography variant="body1">{rezept.anweisungen}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RezeptDetails;
