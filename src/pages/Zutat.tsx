import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

interface ZutatProps {
  name: string;
  imageUrl: string;
}

const Zutat: React.FC<ZutatProps> = ({ name, imageUrl }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        alt={`Zutat der Woche: ${name}`}
        height="400"
        image={imageUrl}
        style={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h5" component="div" align="center">
          {name}
        </Typography>
        <Typography variant="body1" align="center">
          {name} 
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Zutat;
