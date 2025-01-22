import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface User {
  id: number;
  username: string;
  passwort: string;
  emailAdresse: string;
}

interface Zutat {
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

interface Timer {
  zeit: number;
}

interface TimerPosition {
  timer: Timer;
  position: number;
}

interface Rezept {
  id: number;
  anweisungen: string;
  zeit: number;
  schwierigkeit: number;
  defaultPortionen: number;
  foto: string;
  user_Id: User;
  durchschnittlicheBewertung: number;
  name: string;
}

interface RezeptMitZutaten {
  rezept: Rezept;
  zutatMengeList: ZutatMenge[];
  timerPositionList: TimerPosition[];
}

interface ZutatDerWoche {
  id: number;
  name: string;
  imgUrl: string;
  von: string;
  bis: string;
  zutat: Zutat;
}

interface RezeptCarouselProps {
  rezepte: Rezept[];
  zutatDerWoche: ZutatDerWoche;
}

const API_URL = 'http://localhost:8080'

export const fetchFullRezeptCarousel = async (rezepteId: number): Promise<RezeptMitZutaten> => {
  try {
    const response = await fetch(`${API_URL}/rezepte/full/${rezepteId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const fullRezept: RezeptMitZutaten = await response.json(); // Antwort als JSON-Objekt zurückgeben

    // Sicherstellen, dass alle nötigen Daten vorhanden sind
    if (!fullRezept.rezept || !fullRezept.zutatMengeList) {
      throw new Error(`Fehlende Daten für Rezept ${rezepteId}`);
    }

    return fullRezept;
  } catch (error) {
    console.error('Fehler beim Laden des vollständigen Rezepts:', error);
    throw error;
  }
};




const RezeptCarousel: React.FC<RezeptCarouselProps> = ({ rezepte, zutatDerWoche }) => {
  const [filteredRezepte, setFilteredRezepte] = useState<RezeptMitZutaten[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndFilterRezepte = async () => {
      try {
        const matchingRezepte: RezeptMitZutaten[] = [];
        console.log('Zutat der Woche:', zutatDerWoche);
        console.log('Alle Rezepte:', rezepte);
  
        for (const rezept of rezepte) {
          try {
            const fullRezept = await fetchFullRezeptCarousel(rezept.id);
            console.log('Lade vollständiges Rezept:', fullRezept);
  
            // Sicherstellen, dass Zutaten immer vorhanden sind
            const zutatenListe = fullRezept?.zutatMengeList || [];
  
            if (zutatenListe.length > 0) {
              const containsZutat = zutatenListe.some((zutatMenge) => {
                return (
                  zutatMenge.zutat.name.trim().toLowerCase() ===
                  zutatDerWoche.name.trim().toLowerCase()
                );
              });
  
              console.log(`Rezept ${rezept.id} enthält Zutat der Woche:`, containsZutat);
  
              if (containsZutat) {
                matchingRezepte.push(fullRezept);
              }
            } else {
              console.warn(`Rezept ${rezept.id} hat keine Zutaten oder zutatMengeList ist leer.`);
            }
          } catch (error) {
            console.error(`Fehler beim Laden des vollständigen Rezepts für ID ${rezept.id}:`, error);
            // Hier wird der Fehler für dieses Rezept protokolliert, aber der Schleifenprozess wird fortgesetzt
          }
        }
  
        console.log('Gefilterte Rezepte:', matchingRezepte);
        setFilteredRezepte(matchingRezepte);
      } catch (err) {
        console.error('Fehler beim Laden der Rezepte:', err);
        setError('Fehler beim Laden der Rezepte.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchAndFilterRezepte();
  }, [rezepte, zutatDerWoche]);
  
  
  
  

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6">Lade Rezepte...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (filteredRezepte.length === 0) {
    return (
      <Typography variant="h6" align="center">
        Keine Rezepte mit der Zutat der Woche gefunden. <br />
        Versuchen Sie es mit einer anderen Zutat.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Rezepte mit der Zutat der Woche: {zutatDerWoche.name}
      </Typography>
      {filteredRezepte.map((fullRezept) => (
        <Box key={fullRezept.rezept.id} sx={{ mb: 2 }}>
          <Typography variant="h6">{fullRezept.rezept.name}</Typography>
          <Typography variant="body2">{fullRezept.rezept.anweisungen}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default RezeptCarousel;
