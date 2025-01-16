// src/components/RezeptDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Container
} from '@mui/material';
import { fetchRezeptDetails, fetchRezeptByIdImage, fetchTimer } from '../services/api';
import { useCart } from '../context/CartContext';
import { useCheckedContext } from '../context/CheckedContext';
import styles from '../RezeptDetails.module.css';
import { Flame, Microwave, User } from 'lucide-react';

const RezeptDetails: React.FC = () => {
  const { rezeptId } = useParams<{ rezeptId: string }>();
  const [rezept, setRezept] = useState<any>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [checkedZutaten, setCheckedZutaten] = useState<Set<number>>(new Set());
  const { addItemToCart, removeItemFromCart } = useCart();
  const { setCheckedCount } = useCheckedContext();

  useEffect(() => {
    if (rezeptId) {
      fetchRezeptDetails(Number(rezeptId))
        .then((data) => {
          if (data) {
            setRezept(data);
            setRemainingTime(data.zeit);
          }
        })
        .catch((error) => console.error('Fehler beim Laden des Rezepts:', error));

      fetchRezeptByIdImage(Number(rezeptId))
        .then((data) => setImageUrl(data.imageUrl))
        .catch((error) => console.error('Fehler beim Laden des Bildes:', error));
    }
  }, [rezeptId]);

  const handleCheckboxChange = (zutatId: number, zutatName: string) => {
    setCheckedZutaten((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(zutatId)) {
        newChecked.delete(zutatId);
        removeItemFromCart(zutatId);
      } else {
        newChecked.add(zutatId);
        addItemToCart({ id: zutatId, name: zutatName, quantity: 1 });
      }
      setCheckedCount(newChecked.size);
      return newChecked;
    });
  };

  const startTimer = () => {
    if (rezept && rezept.zeit) {
      fetchTimer(rezept.zeit)
        .then((response) => {
          console.log('Timer gestartet:', response); // Zeigt die Antwort vom Server an
          // Hier kannst du zusätzliche Logik hinzufügen, um den Timer im UI anzuzeigen
        })
        .catch((error) => {
          console.error('Fehler beim Starten des Timers:', error);
          // Optional: Zeige eine Benutzerwarnung im UI an, wenn ein Fehler auftritt
          alert('Fehler beim Starten des Timers. Bitte versuche es erneut.');
        });
    }
  };
  

  if (!rezept) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ padding: '24px 0' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ padding: 4, borderRadius: 4, boxShadow: 3 }}>
            <CardMedia
              component="img"
              alt={rezept.name}
              height="300"
              image={imageUrl || rezept.foto}
              className={styles.cardImage}
            />
            <Box display="flex" flexDirection="column" alignItems="center" padding={3}>
              <Box display="flex" alignItems="center" marginBottom={2}>
                <Typography variant="body1" marginRight={2}>Schwierigkeit:</Typography>
                {[...Array(rezept.schwierigkeit || 0)].map((_, index) => (
                  <Flame key={`schwierigkeit-${index}`} size={24} style={{ marginRight: 4 }} />
                ))}
              </Box>
              <Box display="flex" alignItems="center" marginBottom={2}>
                <Typography variant="body1" marginRight={2}>Portionen:</Typography>
                {[...Array(rezept.defaultPortionen || 0)].map((_, index) => (
                  <User key={`portionen-${index}`} size={24} style={{ marginRight: 4 }} />
                ))}
              </Box>
              <Button
                variant="contained"
                color="primary"
                className={styles.cardButton}
                onClick={startTimer} // Timer starten
              >
                <Microwave size={20} style={{ marginRight: 8 }} />
                Kochzeit: {remainingTime} Minuten
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ padding: 4, borderRadius: 4, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Zutaten</Typography>
              <div className={styles.zutatenListe}>
                {rezept.zutaten.map((zutat: any) => (
                  <FormControlLabel
                    key={zutat.id}
                    control={
                      <Checkbox
                        checked={checkedZutaten.has(zutat.id)}
                        onChange={() => handleCheckboxChange(zutat.id, zutat.name)}
                        name={zutat.name}
                      />
                    }
                    label={zutat.name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ padding: 4, borderRadius: 4, boxShadow: 3 , marginTop: 5}}>
  <CardContent>
    <Typography variant="h6" gutterBottom>Anweisungen</Typography>
    <Typography variant="body1">{rezept.anweisungen}</Typography>
  </CardContent>
</Card>

    </Container>
  );
};

export default RezeptDetails;
