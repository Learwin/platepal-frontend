import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { fetchRezeptByIdImage, fetchRezeptByIdImageCarousel } from '../services/api';
import { useNavigate } from 'react-router-dom';

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

const API_URL = 'http://localhost:8080';

export const fetchFullRezeptCarousel = async (rezepteId: number): Promise<RezeptMitZutaten> => {
  try {
    const response = await fetch(`${API_URL}/rezepte/full/${rezepteId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Fehler beim Laden des vollständigen Rezepts:', error);
    throw error;
  }
};

const RezeptCarousel: React.FC<RezeptCarouselProps> = ({ rezepte, zutatDerWoche }) => {
  const [filteredRezepte, setFilteredRezepte] = useState<RezeptMitZutaten[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({}); // State für die Bild-URLs

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleClick = (rezeptId: number) => {
    navigate(`/rezept/${rezeptId}`);
  };

  useEffect(() => {
    const fetchAndFilterRezepte = async () => {
      if (!rezepte || rezepte.length === 0 || !zutatDerWoche) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const matchingRezepte: RezeptMitZutaten[] = [];

        await Promise.all(rezepte.map(async (rezept) => {
          try {
            let fullRezept = await fetchFullRezeptCarousel(rezept.id);

            // **Workaround (sauberere Implementierung):**
            if (!fullRezept) {
              console.warn(`Rezept ${rezept.id}: fullRezept ist null/undefined. Rezept wird ignoriert.`);
              return; // Rezept überspringen, wenn kein fullRezept vorhanden ist
            }

            const isMatching = fullRezept.zutatMengeList.some(zutatMenge =>
              (zutatMenge.zutat?.name?.trim().toLowerCase() ?? "") === (zutatDerWoche?.name?.trim().toLowerCase() ?? "")
            );

            if (isMatching) {
              matchingRezepte.push(fullRezept);
              // Holen der Bild-URL nur einmal
              const imageResponse = await fetchRezeptByIdImageCarousel(rezept.id);
              if (imageResponse.imageUrl) {
                setImageUrls(prevUrls => ({
                  ...prevUrls,
                  [rezept.id]: imageResponse.imageUrl
                }));
              }
            }
          } catch (innerError) {
            console.error(`Fehler beim Laden von fullRezept für ${rezept.id}:`, innerError);
          }
        }));

        setFilteredRezepte(matchingRezepte.length > 0 ? matchingRezepte : []);
      } catch (err) {
        setError('Fehler beim Laden der Rezepte.');
        console.error("Fehler beim fetchen", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterRezepte();
  }, [rezepte, zutatDerWoche]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!filteredRezepte || filteredRezepte.length === 0) {
    return <Typography>Keine Rezepte mit der Zutat der Woche gefunden.</Typography>;
  }

  return (
    <Box>
      <Carousel
        showArrows={false} // Pfeile entfernen
        showThumbs={false} // Thumbnails entfernen
        showStatus={false} // Statusleiste (z. B. "1/5") entfernen
        autoPlay={!isHovered} // Nur abspielen, wenn nicht gehovt
        infiniteLoop
        interval={2000} // Standardwiedergabeintervall (3 Sekunden)
      >
        {filteredRezepte.map((fullRezept) => {
          const imageUrl = imageUrls[fullRezept.rezept.id] || 'fallback-image.jpg';
          return (
            <Box
              key={fullRezept.rezept.id}
              sx={{ display: 'flex', justifyContent: 'center', p: 2 }}
              onMouseEnter={handleMouseEnter} // Hovern starten
              onMouseLeave={handleMouseLeave} // Hovern beenden
            >
              <Card
                sx={{
                  width: '100%',
                  height: '65%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  backgroundColor: 'white',
                  overflow: 'hidden',
                }}
                onClick={() => handleClick(fullRezept.rezept.id)} // Klickhandler hinzufügen
              >
                <CardMedia
                  component="img"
                  image={imageUrl} // fallback-image.jpg als Platzhalter
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '300px', // Setze eine Höhe für das Bild
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {fullRezept.rezept.name}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Carousel>
    </Box>
  );
};

export default RezeptCarousel;
