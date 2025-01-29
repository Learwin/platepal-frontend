import React, { useState } from 'react';
import { TextField, IconButton, Tooltip, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from '../Layout.module.css';
import { Beef, Heart, Sprout, Vegan, Salad, WheatOff, MilkOff, Dessert, BicepsFlexed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchProps {
  onSearchChange: (searchTerm: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  // Handhabung der Eingabe in der Suchleiste
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  // Behandlung des Suchformulars
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      onSearchChange(searchTerm.trim());
    }
  };

  // Behandlung des Klicks auf Kategorien
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/kategorie/${categoryName}`);
  };

  return (
    <div className={styles.searchContainer}>
      {/* Suchleiste */}
      <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
        <TextField
          label="Suche nach Rezepten..."
          variant="outlined"
          value={searchTerm}
          onChange={handleInputChange}
          className="searchInput"
          style={{ width: '100%', maxWidth: '400px', margin: '10px 0' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>

      {/* Kategorie-Buttons */}
      <div className={styles.categoriesContainer}>
  {categories.map((category) => (
    <div key={category.name}>
      <Tooltip title={category.name} placement="top">
        <IconButton
          onClick={() => handleCategoryClick(category.name)}
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
    </div>
  ))}
</div>

    </div>
    
  );
};

export default Search;
