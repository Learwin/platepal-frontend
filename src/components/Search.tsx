import React, { useState } from 'react';
import { TextField, IconButton, Tooltip } from '@mui/material';
import styles from '../Layout.module.css';
import { Beef, Heart, Sprout, Vegan, Salad, WheatOff, MilkOff, Dessert, BicepsFlexed } from 'lucide-react';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');

  const categories = [
    { name: 'Fleisch', icon: <Beef /> },
    { name: 'Vegetarisch', icon: <Salad /> },
    { name: 'Vegan', icon: <Vegan /> },
    { name: 'Glutenfrei', icon: <WheatOff /> },
    { name: 'Laktosefrei', icon: <MilkOff /> },
    { name: 'Low Carb', icon: <Sprout /> },
    { name: 'Diabetikerfreundlich', icon: <Heart /> },
    { name: 'High Protein', icon: <BicepsFlexed /> },
    { name: 'Dessert', icon: <Dessert /> },
];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      {/* Suchfeld */}
      <div className={styles.searchBar}>
        <TextField
          label="Search for categories..."
          variant="outlined"
          value={query}
          onChange={handleSearchChange}
          className="searchInput"
        />
      </div>

      {/* Kategorien */}
      <div className={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <Tooltip title={category.name} placement="top" key={index}>
            <IconButton
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#E7B84B',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': { backgroundColor: '#D9A63F' },
              }}
            >
              {category.icon}
            </IconButton>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default Search;
