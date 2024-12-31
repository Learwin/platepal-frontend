import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

interface RezeptProps {
    id: number
  name: string;
  imageUrl: string;
}

const Rezept: React.FC<RezeptProps> = ({ name, imageUrl }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        alt={`Rezept: ${name}`}
        height="400"
        image={imageUrl || 'https://via.placeholder.com/400'}
        style={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h5" component="div" align="center">
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Rezept;
