import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Flame, Star, User } from 'lucide-react';
import { fetchRezeptByIdImageCarousel, fetchRezepteByName } from '../services/api';
import styles from '../SearchRecipe.module.css';

interface Rezept {
  id: number;
  anweisungen: string;
  zeit: number;
  schwierigkeit: number;
  defaultPortionen: number;
  foto: string;
  durchschnittlicheBewertung: number;
  name: string;
}

const SearchRecipe: React.FC = () => {
  const { searchTerm } = useParams(); // Hole den searchTerm aus der URL
  const [searchResults, setSearchResults] = useState<Rezept[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({}); // Bild-URLs speichern
  const navigate = useNavigate();

  // Rezepte anhand des Suchbegriffs abrufen
  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm && searchTerm.trim()) {
        setIsLoading(true);
        try {
          const data = await fetchRezepteByName(searchTerm.trim());
          setSearchResults(data);

          // Bild-URLs für die gefundenen Rezepte abrufen
          const images = await Promise.all(
            data.map(async (rezept) => {
              try {
                const imageResponse = await fetchRezeptByIdImageCarousel(rezept.id);
                return { id: rezept.id, url: imageResponse.imageUrl || './bild.png' };
              } catch (error) {
                console.error(`Fehler beim Laden des Bildes für Rezept ${rezept.id}:`, error);
                return { id: rezept.id, url: './bild.png' }; // Fallback-Bild
              }
            })
          );

          // Bild-URLs im State speichern
          const imageMap = images.reduce((acc, { id, url }) => {
            acc[id] = url;
            return acc;
          }, {} as { [key: number]: string });

          setImageUrls(imageMap);
        } catch (error) {
          console.error('Fehler beim Abrufen der Suchergebnisse:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults(null);
      }
    };

    fetchResults();
  }, [searchTerm]);

  // Keine Ergebnisse anzeigen, wenn kein Suchbegriff eingegeben wurde
  if (!searchTerm || !searchTerm.trim()) {
    return null;
  }

  // Rezept-Seite bei Klick auf ein Rezept öffnen
  const handleClick = (rezeptId: number) => {
    navigate(`/rezept/${rezeptId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: '24px 0' }}>
      <Typography variant="h4" gutterBottom className={styles.zutatBalken}>
        Suchergebnisse für "{searchTerm}"
      </Typography>

      {isLoading ? (
        <Typography variant="body1" sx={{ marginTop: 4 }}>
          Lade Ergebnisse...
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((rezept) => (
              <Grid item xs={12} sm={6} md={4} key={rezept.id}>
                <Card
                  sx={{
                    padding: 4,
                    borderRadius: 4,
                    boxShadow: 3,
                    height: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                  onClick={() => handleClick(rezept.id)}
                >
                  <CardMedia
                    component="img"
                    alt={rezept.name}
                    height="150"
                    image={imageUrls[rezept.id] || './bild.png'} // Individuelle Bild-URL
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

export default SearchRecipe;
