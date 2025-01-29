import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Flame, Star, User } from 'lucide-react';
import styles from '../KategorieRezept.module.css';
import { fetchRezeptByIdImageCarousel } from '../services/api';

interface Einheit {
  id: number;
  name: string;
  abkuerzung: string;
}

interface Allergene {
  id: number;
  name: string;
  zutaten: Zutat[];
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
  foto: string;
  allergene: string[];
}

interface ZutatMenge {
  allergene: Allergene[];
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

interface User {
  id: number;
  username: string;
  passwort: string;
  emailAdresse: string;
  foto: string;
  flag: number;
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
  zutatMengeList: ZutatMenge[];
}

const API_URL = 'http://localhost:8080';

const fetchRezepte = async (): Promise<Rezept[]> => {
  try {
    const response = await fetch(`${API_URL}/rezepte/list`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fehler beim Laden der Rezepte:', error);
    throw error;
  }
};

const KategorieRezepte: React.FC = () => {
  const { categoryName } = useParams();
  const [categoryResults, setCategoryResults] = useState<Rezept[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({}); // Bild-URLs speichern

  useEffect(() => {
    const fetchCategoryRezepte = async () => {
      setLoading(true);
      setError('');
      try {
        const allRezepte = await fetchRezepte();
        const filteredRezepte = allRezepte.filter((rezept) => {
          const matchesCategory = rezept.zutatMengeList?.some((zutatMenge) =>
            zutatMenge.zutat?.name.toLowerCase().includes(categoryName?.toLowerCase() || '')
          );
          const matchesRezeptName = rezept.name.toLowerCase().includes(categoryName?.toLowerCase() || '');
          return matchesCategory || matchesRezeptName;
        });

        // Bilder für jedes Rezept abrufen
        const imagePromises = filteredRezepte.map(async (rezept) => {
          const { imageUrl } = await fetchRezeptByIdImageCarousel(rezept.id); // Bild-URL abrufen
          return { rezeptId: rezept.id, imageUrl };
        });

        const images = await Promise.all(imagePromises);

        // Map erstellen, um die Bild-URLs zu speichern
        const imageMap = images.reduce((acc, { rezeptId, imageUrl }) => {
          acc[rezeptId] = imageUrl;
          return acc;
        }, {} as { [key: number]: string });

        setCategoryResults(filteredRezepte);
        setImageUrls(imageMap); // Bild-URLs im Zustand speichern
      } catch (error) {
        setError('Fehler beim Laden der Rezepte.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchCategoryRezepte();
    }
  }, [categoryName]);

  const handleClick = (rezeptId: number) => {
    navigate(`/rezept/${rezeptId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: '24px 0' }}>
      <Typography variant="h4" gutterBottom className={styles.categoryTitle}>
        Rezepte für Kategorie: "{categoryName}"
      </Typography>

      {loading ? (
        <Typography variant="body1" sx={{ marginTop: 4 }}>
          Lade Ergebnisse...
        </Typography>
      ) : error ? (
        <Typography variant="body1" sx={{ marginTop: 4 }}>
          {error}
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {categoryResults && categoryResults.length > 0 ? (
            categoryResults.map((rezept) => (
              <Grid item xs={12} sm={6} md={4} key={rezept.id}>
                <Card
                  sx={{
                    padding: 4,
                    borderRadius: 4,
                    boxShadow: 3,
                    height: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onClick={() => handleClick(rezept.id)}
                >
                  <CardMedia
                    component="img"
                    alt={rezept.name}
                    height="150"
                    image={imageUrls[rezept.id] || '/placeholder-image.jpg'}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {rezept.name}
                    </Typography>
                    <Box display="flex" alignItems="center" marginBottom={2}>
                      <Typography variant="body1" marginRight={2}>
                        Schwierigkeit:
                      </Typography>
                      {[...Array(rezept.schwierigkeit)].map((_, index) => (
                        <Flame key={`schwierigkeit-${index}`} size={16} style={{ marginRight: 4 }} />
                      ))}
                    </Box>
                    <Box display="flex" alignItems="center" marginBottom={2}>
                      <Typography variant="body1" marginRight={2}>
                        Portionen:
                      </Typography>
                      {[...Array(rezept.defaultPortionen)].map((_, index) => (
                        <User key={`portionen-${index}`} size={16} style={{ marginRight: 4 }} />
                      ))}
                    </Box>
                    <Box display="flex" alignItems="center" marginBottom={2}>
                      <Typography variant="body1" marginRight={2}>
                        Bewertungen:
                      </Typography>
                      {[...Array(rezept.durchschnittlicheBewertung)].map((_, index) => (
                        <Star key={`bewertungen-${index}`} size={16} style={{ marginRight: 4 }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ marginTop: 4 }}>
              Keine Ergebnisse gefunden.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default KategorieRezepte;
