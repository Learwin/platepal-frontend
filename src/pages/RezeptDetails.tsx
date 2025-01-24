import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card, CardMedia, CardContent, Typography, Box, Button,
  FormControlLabel, Grid, Container, Checkbox,
  Tooltip,
  IconButton
} from '@mui/material';
import { fetchRezeptByIdImage, fetchTimer } from '../services/api'; // fetchFullRezeptDetails importiert
import styles from '../RezeptDetails.module.css';
import { Flame, Microwave, Star, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCheckedContext } from '../context/CheckedContext';
import NaehrwerteRezepte from './NaehrwerteRezepte';
import InfoIcon from '@mui/icons-material/Info';

// Interfaces (Bitte an deine tatsächlichen Interfaces anpassen!)
interface Zutat {
  id: number;
  name: string;
  // ... andere Eigenschaften
}

interface Einheit {
  id: number;
  name: string;
}

interface ZutatMenge {
  menge: number;
  einheit: Einheit;
  zutat: Zutat;
}

interface Rezept {
  id: number;
  anweisungen: string;
  zeit: number;
  schwierigkeit: number;
  defaultPortionen: number;
  foto: string;
  durchschnittlicheBewertung: number;
  name: string;
  zutat: ZutatMenge[];
}

interface RezeptMitZutaten {
  rezept: Rezept;
  zutatMengeList: ZutatMenge[];
  timerPositionList: any[]; // Hier den korrekten Typ verwenden, falls vorhanden
}

interface Naehrwerte {
  id: number;
  name: string;
  kcal: number;
  fett: number;
  gesaettigteFettsaeuren: number;
  kohlenhydrate: number;
  zucker: number;
  ballaststoffe: number;
  eiweiss: number;
  salz: number;
  foto: string;
}


const API_URL = 'http://localhost:8080';

export const fetchFullRezeptDetails = async (rezepteId: number): Promise<RezeptMitZutaten> => {
  try {
    const response = await fetch(`${API_URL}/rezepte/full/${rezepteId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Antwort als JSON-Objekt zurückgeben
  } catch (error) {
    console.error('Error fetching full recipe:', error);
    throw error;
  }
};

export const getNutrition = async (rezepteId: number) =>{
  try {
    const response = await fetch(`${API_URL}/rezepte/nutrition/${rezepteId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Antwort als JSON-Objekt zurückgeben
  } catch (error) {
    console.error('Error fetching full recipe:', error);
    throw error;
  }
}



const RezeptDetails: React.FC = () => {
  const { rezeptId } = useParams<{ rezeptId: string }>();
  const [fullRezept, setFullRezept] = useState<RezeptMitZutaten | null>(null); // State für das vollständige Rezept
  const [imageUrl, setImageUrl] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [checkedZutaten, setCheckedZutaten] = useState<Set<number>>(new Set());
  const [naehrwerte, setNaehrwerte] = useState<Naehrwerte | null>(null); // RICHTIG!
  
  const { addItemToCart, removeItemFromCart } = useCart();
  const { setCheckedCount } = useCheckedContext();

  useEffect(() => {
    if (rezeptId) {
        const rezeptIdNumber = Number(rezeptId);
        Promise.all([
            fetchFullRezeptDetails(rezeptIdNumber),
            fetchRezeptByIdImage(rezeptIdNumber),
            getNutrition(rezeptIdNumber) // Nährwerte abrufen
        ])
        .then(([fullRezeptData, imageUrlData, naehrwerteData]) => {
            if (fullRezeptData) {
                setFullRezept(fullRezeptData);
                console.log("Full Rezept Daten:", fullRezeptData); // Wichtig!
                setRemainingTime(fullRezeptData.rezept.zeit || 0);
            } else {
                console.error('Keine Rezeptdaten gefunden');
                setFullRezept(null);
            }
            if(imageUrlData){
                setImageUrl(imageUrl);
                console.log("imageUrlData", imageUrlData);
            }
            if (naehrwerteData) {
              setNaehrwerte(naehrwerteData);
          } else {
              console.error("Keine Nährwertedaten gefunden");
          }
            
        })
        .catch((error) => console.error('Fehler beim Laden des Rezepts, Bildes oder der Nährwerte:', error));
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
    if (fullRezept && fullRezept.rezept.zeit > 0) {
      fetchTimer(fullRezept.rezept.zeit)
        .then((response) => console.log('Timer gestartet:', response))
        .catch((error) => {
          console.error('Fehler beim Starten des Timers:', error);
          alert('Fehler beim Starten des Timers. Bitte versuche es erneut.');
        });
    } else {
      alert('Keine gültige Kochzeit verfügbar.');
    }
  };

  if (!fullRezept) {
    return (
      <Container maxWidth="lg" sx={{ padding: '24px 0', textAlign: 'center' }}>
        <Typography variant="h6">Rezept wird geladen...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ padding: '24px 0' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ padding: 4, borderRadius: 4, boxShadow: 3 }}>
            <Box sx={{ position: 'relative' }}> {/* WICHTIG: Relative Positionierung */}
              <CardMedia
                component="img"
                alt={fullRezept.rezept.name}
                height="300"
                image={imageUrl || fullRezept.rezept.foto || '/placeholder-image.jpg'}
                className={styles.cardImage}
              />
              {naehrwerte && ( // Bedingte Renderung
                <Tooltip
                  title={<NaehrwerteRezepte naehrwerte={naehrwerte} name={fullRezept.rezept.name} />}
                  arrow
                  placement="top"
                >
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      zIndex: 10,
                      borderRadius: '50%',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              )}
                
            </Box> {/* Ende des Box mit relative Positionierung */}
            <Box display="flex" flexDirection="column" alignItems="center" padding={3}>
              <Box display="flex" alignItems="center" marginBottom={2}>
                <Typography variant="body1" marginRight={2}>Schwierigkeit:</Typography>
                {[...Array(fullRezept.rezept.schwierigkeit || 0)].map((_, index) => (
                  <Flame key={`schwierigkeit-${index}`} size={24} style={{ marginRight: 4 }} />
                ))}
              </Box>
              <Box display="flex" alignItems="center" marginBottom={2}>
                <Typography variant="body1" marginRight={2}>Portionen:</Typography>
                {[...Array(fullRezept.rezept.defaultPortionen || 0)].map((_, index) => (
                  <User key={`portionen-${index}`} size={24} style={{ marginRight: 4 }} />
                ))}
              </Box>
              <Box display="flex" alignItems="center" marginBottom={2}>
                <Typography variant="body1" marginRight={2}>Portionen:</Typography>
                {[...Array(fullRezept.rezept.durchschnittlicheBewertung || 0)].map((_, index) => (
                  <Star key={`bewertungen-${index}`} size={24} style={{ marginRight: 4 }} />
                ))}
              </Box>
              <Button
                variant="contained"
                color="primary"
                className={styles.cardButton}
                onClick={startTimer}
              >
                <Microwave size={20} style={{ marginRight: 8 }} />
                Kochzeit: {remainingTime} Minuten
              </Button>
            </Box>
          </Card>
          {/* Tooltip mit Nährwerten */}
          
        </Grid>
     
       

        <Grid item xs={12} sm={6}>
          <Card sx={{ padding: 4, borderRadius: 4, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Zutaten</Typography>
              <div className={styles.zutatenListe}>
                {fullRezept.zutatMengeList && fullRezept.zutatMengeList.length > 0 ? ( // Überprüfung hinzugefügt
                  fullRezept.zutatMengeList.map((zutatMenge) => (
                    <FormControlLabel
                      key={zutatMenge.zutat.id}
                      control={
                        <Checkbox
                          checked={checkedZutaten.has(zutatMenge.zutat.id)}
                          onChange={() => handleCheckboxChange(zutatMenge.zutat.id, zutatMenge.zutat.name)}
                          name={zutatMenge.zutat.name}
                        />
                      }
                      label={`${zutatMenge.zutat.name} (${zutatMenge.menge} ${zutatMenge.einheit.name})`}
                    />
                  ))
                ) : (
                  <Typography variant="body2">Keine Zutaten vorhanden</Typography>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
        {/* ... Anweisungen */}
      </Grid>

      <Card sx={{ padding: 4, borderRadius: 4, boxShadow: 3 , marginTop: 5}}>
  <CardContent>
    <Typography variant="h6" gutterBottom>Anweisungen</Typography>
    <Typography variant="body1">{fullRezept.rezept.anweisungen}</Typography>
  </CardContent>
</Card>
    </Container>
  );
};

export default RezeptDetails;