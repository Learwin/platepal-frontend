    
import React, { useState } from 'react';
import { Box, Button, TextField, List, ListItem, ListItemText, Divider } from '@mui/material';
import styles from '../Rezepturverwaltung.module.css'; // Stelle sicher, dass du das CSS korrekt anpasst
import { CirclePlus } from 'lucide-react';
import { fetchRezepte, uploadImage } from '../services/api';

interface Recipe {
  id: number;
  anweisungen: string;
  zeit: number;
  schwierigkeit: number;
  defaultPortionen: number;
  foto: string;
  user_Id: {
    id: number;
    username: string;
  };
  durchschnittlicheBewertung: number;
  flag: number;
  name: string;
}

const Rezepturverwaltung: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 1,
      anweisungen: 'Butter schmelzen',
      zeit: 20,
      schwierigkeit: 2,
      defaultPortionen: 2,
      foto: './images/rezept/132690-subway-cookie-2.png',
      user_Id: { id: 5, username: 'Angela Merkel' },
      durchschnittlicheBewertung: 3.0,
      flag: 0,
      name: 'Cookies',
    },
  ]);

  const [newRecipe, setNewRecipe] = useState<Recipe>({
    id: 0,
    anweisungen: '',
    zeit: 0,
    schwierigkeit: 1,
    defaultPortionen: 2,
    foto: './images/rezept/132690-subway-cookie-2.png',
    user_Id: { id: 1, username: 'Max Mustermann' },
    durchschnittlicheBewertung: 0,
    flag: 0,
    name: '',
  });

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Recipe) => {
    setNewRecipe({ ...newRecipe, [field]: event.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRecipe((prevRecipe) => ({ ...prevRecipe, foto: reader.result as string }));
      };
      reader.readAsDataURL(file); // Bild als Base64-URL laden
    }
  };


  const handleSaveRecipe = async () => {
    try {
      // Ermittelung der nächsten Rezept-ID
      const nextId = await fetchNextRecipeId();
      let imageUrl = newRecipe.foto;
  
      // Falls ein neues Bild hochgeladen wurde, Bild hochladen und URL speichern
      if (newRecipe.foto && newRecipe.foto.startsWith('data:image')) {
        const file = await fetch(newRecipe.foto)
          .then((res) => res.blob())
          .then(
            (blob) => new File([blob], `recipe_${nextId}.png`, { type: blob.type })
          );
        imageUrl = await uploadImage(nextId, file);
      }
  
      const newRecipeWithId = {
        ...newRecipe,
        id: nextId,
        foto: imageUrl,
      };
  
      // Neues Rezept der Liste hinzufügen
      setRecipes((prevRecipes) => [...prevRecipes, newRecipeWithId]);
  
      // Formular zurücksetzen
      setNewRecipe({
        id: 0,
        anweisungen: '',
        zeit: 0,
        schwierigkeit: 0,
        defaultPortionen: 0,
        foto: '',
        user_Id: { id: 0, username: '' },
        durchschnittlicheBewertung: 0,
        flag: 0,
        name: '',
      });
  
      setIsFormVisible(false);
    } catch (error) {
      console.error('Fehler beim Speichern des Rezepts:', error);
      alert('Fehler beim Speichern oder Hochladen des Bildes.');
    }
  };
  


  const handleEdit = (id: number) => {
    const recipeToEdit = recipes.find((recipe) => recipe.id === id);
    if (recipeToEdit) {
      setNewRecipe(recipeToEdit);
      setIsFormVisible(true);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Möchten Sie dieses Rezept wirklich löschen?')) {
      setRecipes(recipes.filter((recipe) => recipe.id !== id));
    }
  };


  const handleAddRecipeClick = async () => {
    try {
      const nextId = await fetchNextRecipeId();
      setNewRecipe((prevRecipe) => ({ ...prevRecipe, id: nextId }));
      setIsFormVisible(true);
    } catch (error) {
      alert('Fehler beim Laden der nächsten Rezept-ID.');
    }
  };
  const fetchNextRecipeId = async (): Promise<number> => {
    try {
      const rezepte = await fetchRezepte();
      const maxId = rezepte.reduce((max, recipe) => Math.max(max, recipe.id), 0);
      return maxId + 1;
    } catch (error) {
      console.error('Fehler beim Ermitteln der nächsten Rezept-ID:', error);
      throw error;
    }
  };
  
  





  return (
    <div className={styles.rezepturContainer}>
      <Box>
        {/* Button nur anzeigen, wenn das Formular nicht sichtbar ist */}
        {!isFormVisible && (
          <Button
          variant="contained"
          className={styles.addRecipeButton}
          onClick={handleAddRecipeClick}
          startIcon={<CirclePlus />}
        >
          Rezept hinzufügen
        </Button>
        
        )}

        {/* Formular anzeigen, wenn isFormVisible true ist */}
        {isFormVisible && (
          <Box className={styles.rezeptForm}>
            <TextField
              label="Rezeptname"
              variant="outlined"
              value={newRecipe.name}
              onChange={(e) => handleInputChange(e, 'name')}
              fullWidth
              style={{ marginBottom: 15 }}
            />
            <TextField
              label="Anweisungen"
              variant="outlined"
              value={newRecipe.anweisungen}
              onChange={(e) => handleInputChange(e, 'anweisungen')}
              fullWidth
              multiline
              rows={4}
              style={{ marginBottom: 15 }}
            />
            <TextField
              label="Zeit (Minuten)"
              variant="outlined"
              type="number"
              value={newRecipe.zeit}
              onChange={(e) => handleInputChange(e, 'zeit')}
              fullWidth
              style={{ marginBottom: 15 }}
            />
            <TextField
              label="Schwierigkeit"
              variant="outlined"
              type="number"
              value={newRecipe.schwierigkeit}
              onChange={(e) => handleInputChange(e, 'schwierigkeit')}
              fullWidth
              style={{ marginBottom: 15 }}
            />
            <TextField
              label="Portionen"
              variant="outlined"
              type="number"
              value={newRecipe.defaultPortionen}
              onChange={(e) => handleInputChange(e, 'defaultPortionen')}
              fullWidth
              style={{ marginBottom: 15 }}
            />

            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ marginTop: 2 }}  // Verwende sx statt margin
            >
              Foto auswählen
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {newRecipe.foto && (
              <Box mt={2}>
                <img src={newRecipe.foto} alt="Zutat Foto" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              </Box>
            )}

            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveRecipe}
              style={{ marginTop: 20 }}
            >
              Speichern
            </Button>
          </Box>
        )}

        {/* Rezeptliste nur anzeigen, wenn das Formular nicht sichtbar ist */}
        {!isFormVisible && (
          <List>
            {recipes.map((recipe) => (
              <div key={recipe.id}>
                <ListItem>
                  <ListItemText
                    primary={recipe.name}
                    secondary={`Anweisungen: ${recipe.anweisungen} | Zeit: ${recipe.zeit} Minuten`}
                  />
                  <Button
                    className={styles.editRezeptButton}
                    onClick={() => handleEdit(recipe.id)}
                    style={{ marginRight: 10 }}
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    className={styles.deleteRezeptButton}
                    onClick={() => handleDelete(recipe.id)}
                  >
                    Löschen
                  </Button>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        )}
      </Box>
    </div>
  );
};

export default Rezepturverwaltung;
