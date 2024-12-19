import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import Carousel from 'react-multi-carousel';
import { useNavigate } from 'react-router-dom';

type Rezept = {
  id: number;
  name: string;
  imageUrl: string;
};

type RezepteCarouselProps = {
  rezepte: Rezept[];
};

const RezepteCarousel: React.FC<RezepteCarouselProps> = ({ rezepte }) => {
  const navigate = useNavigate();

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Rezepte der Woche
      </Typography>
      {rezepte.length > 0 ? (
        <Carousel responsive={responsive} infinite autoPlay>
          {rezepte.map((rezept) => (
            <Box
              key={rezept.id}
              sx={{
                padding: '10px',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/rezept/${rezept.id}`)}
            >
              <Card>
                <CardMedia
                  component="img"
                  alt={rezept.name}
                  height="200"
                  image={rezept.imageUrl || 'https://via.placeholder.com/200'}
                  style={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="body1" textAlign="center">
                    {rezept.name}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Carousel>
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          Keine Rezepte verfügbar
        </Typography>
      )}
    </div>
  );
};

export default RezepteCarousel;
