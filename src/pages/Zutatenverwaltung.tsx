import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, List, ListItem, ListItemText, Divider, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Avatar } from '@mui/material';
import { deleteZutat, fetchZutatById } from '../services/api';
import styles from '../Zutatenverwaltung.module.css';
import { CirclePlus } from 'lucide-react';
import { useAuth } from '../context/AuthContextType';
import { Allergen, fetchAllergene, fetchZutatByIdImage, fetchZutatenListe, getDefaultIngredient, postAllergen, postZutat, putZutat, uploadZutatImage, Zutat, ZutatEdit } from '../services/zutatenApi';
import UploadImageZutat from './UploadImaZutatRezept';


const Zutatenverwaltung = () => {
  const [ingredients, setIngredients] = useState<Zutat[]>([]);
  const [newIngredient, setNewIngredient] = useState<Zutat>(getDefaultIngredient());
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [editingIngredient, setEditingIngredient] = useState<ZutatEdit | null>(null); 
  const [allergene, setAllergene] = useState<Allergen[]>([]);
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<number[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedZutatId, setSelectedZutatId] = useState<number | null>(null);
    const [editZutat, setEditZutat] = useState<ZutatEdit>({
      id: 0,
      name: '',
      kcal: 0,
      fett: 0,
      gesaettigteFettsaeuren: 0,
      kohlenhydrate: 0,
      zucker: 0,
      ballaststoffe: 0,
      eiweiss: 0,
      salz: 0,
      allergene: []});

  const { user } = useAuth();

  
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const loadedIngredients = await fetchZutatenListe();
        setIngredients(loadedIngredients);
      } catch (error) {
        console.error(error);
        setAlertMessage('Fehler beim Laden der Zutaten');
        setOpenSnackbar(true);
      }
    };
    const loadAllergene = async () => {
      try {
        const loadedAllergene = await fetchAllergene();
        setAllergene(loadedAllergene);
      } catch (error) {
        console.error('Error fetching Allergene:', error);
        setAlertMessage('Fehler beim Laden der Allergene');
        setOpenSnackbar(true);
      }
    };

    const fetchUserIngredients  = async () => {
          try {
            const userIngredients = await fetchZutatenListe(); // API-Aufruf zum Laden der Rezepte des Benutzers
            console.log("Rezepte geladen:", userIngredients);
        
            // Lade die Bilder für alle Rezepte
            const ingredientsWithImages = await Promise.all(
              userIngredients.map(async (zutat) => {
                try {
                  const { imageUrl } = await fetchZutatByIdImage(zutat.id);
                  return { ...zutat, foto: imageUrl };
                } catch (error) {
                  console.error(`Fehler beim Laden des Bildes für Rezept ${zutat.id}:`, error);
                  return zutat; // Rückgabe des Rezepts ohne Bild
                }
              })
            );
        
            setIngredients(ingredientsWithImages);
          } catch (error) {
            console.error("Fehler beim Laden der Benutzerrezepte:", error);
          }
        };

        
      
    loadIngredients();
    loadAllergene();
    fetchUserIngredients();
  }, []);

  const loadZutatForEdit = async (id: number) => {
    try {
      const editZutat = await fetchZutatById(id);
      if (editZutat) {
        setEditingIngredient(editZutat);
        setIsFormVisible(true);
        fetchZutatByIdImage(editZutat.id)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Zutat:', error);
    }
  };
  
useEffect(() => {
  console.log("newRecipe im useEffect:", editZutat);
}, [editZutat]);


  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Zutat | 'allergene'
  ) => {
    const { value } = event.target;
  
    if (field === 'allergene') {
      // Beispiel für Allergene mit IDs, wenn sie aus einer anderen Quelle kommen
      const allergenList = value
        .split(',')
        .map((allergen, index) => ({
          id: index + 1, // Beispiel-ID, könnte aus einer Datenbank oder API stammen
          name: allergen.trim(),
        }));
      setSelectedAllergenIds(allergenList.map(allergen => allergen.id));
    } else {
      setNewIngredient((prevValue) => ({
        ...prevValue,
        [field]: field === 'name' ? value : parseFloat(value) || 0,
      }));
    }
  };
  
  

  const handleSaveIngredient = async () => {
    if (!newIngredient.name.trim()) {
      setAlertMessage('Bitte alle Pflichtfelder ausfüllen');
      setOpenSnackbar(true);
      return;
    }

    try {
      // Allergene für die neue Zutat hinzufügen
      newIngredient.allergene = allergene.filter(allergen => selectedAllergenIds.includes(allergen.id));

      const savedIngredient = await postZutat(newIngredient);
      setIngredients([...ingredients, savedIngredient]);
      setNewIngredient(getDefaultIngredient());
      setIsFormVisible(false);
      setAlertMessage('Zutat erfolgreich gespeichert!');
    } catch (error) {
      console.error('Fehler beim Speichern der Zutat:', error);
      setAlertMessage('Fehler beim Speichern der Zutat. Bitte versuche es erneut.');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (id: number) => {
    loadZutatForEdit(id); // Diese Funktion aufrufen!
};
  
  const handleSaveEdit = async (ingredient: ZutatEdit) => {
    if (!ingredient.name.trim()) {
      setAlertMessage('Bitte alle Pflichtfelder ausfüllen');
      setOpenSnackbar(true);
      return;
    }
  
    try {
      await putZutat(ingredient);
  
      setIngredients((prevIngredients) =>
        prevIngredients.map((item) =>
          item.id === ingredient.id
            ? { ...item, ...ingredient, foto: item.foto } // Behalte bestehendes Foto
            : item
        )
      );
  
      setAlertMessage('Zutat erfolgreich aktualisiert!');
      setEditingIngredient(null); // Setze den Bearbeitungsmodus zurück
      setIsFormVisible(false); // Verstecke das Formular
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Zutat:', error);
      setAlertMessage('Fehler beim Aktualisieren der Zutat. Bitte versuche es erneut.');
    } finally {
      setOpenSnackbar(true);
    }
  };
  

  const handleDelete = (ingredient: Zutat) => {
    // Logik zum Löschen der Zutat
    setIngredients((prevIngredients) => prevIngredients.filter((item) => item.name !== ingredient.name));
  };

  const fetchAndSetZutatImage = async (id: number) => {
    try {
      // Bild-URL für die Zutat abrufen
      const { imageUrl } = await fetchZutatByIdImage(id);
      
      // State der Zutaten aktualisieren, um das Bild der Zutat zu setzen
      setIngredients((prevIngredients) =>
        prevIngredients.map((ingredient) =>
          ingredient.id === id ? { ...ingredient, foto: imageUrl } : ingredient
        )
      );
    } catch (error) {
      console.error('Fehler beim Abrufen des Zutatbildes:', error);
    }
  };
  
  const handleUploadImage = async (file: File) => {
    if (selectedZutatId === null) {
      return;
    }
  
    try {
      // Bild hochladen
      const uploadedFilePath = await uploadZutatImage(selectedZutatId, file);
      console.log('Uploaded file path:', uploadedFilePath);
  
      // Nach dem Upload das Rezeptbild aktualisieren
      await fetchAndSetZutatImage(selectedZutatId);  // Hier das Bild für das Rezept aktualisieren
  
      console.log('Bild erfolgreich hochgeladen.');
    } catch (error) {
      console.error('Fehler beim Bild-Upload:', error);
    }
  };

  const handleOpenDialog = (zutatId: number) => {
    setSelectedZutatId(zutatId);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedZutatId(null);
  };
  

  return (
    <div className={styles.zutatenContainer}>
      {!isFormVisible && (
        <Button
          variant="contained"
          className={styles.addIngridientButton}
          onClick={() => setIsFormVisible(true)}
          startIcon={<CirclePlus />}
        >
          Zutat Hinzufügen
        </Button>
      )}

      {isFormVisible && (
        <Box className={styles.zutatForm}>
          <TextField
            label="Zutat Name"
            variant="outlined"
            value={editingIngredient ? editingIngredient.name : newIngredient.name}
            onChange={(e) => handleInputChange(e, 'name')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Kalorien (kcal)"
            variant="outlined"
            type="number"
            value={editingIngredient ? editingIngredient.kcal : newIngredient.kcal}
            onChange={(e) => handleInputChange(e, 'kcal')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Fett (g)"
            variant="outlined"
            type="number"
            value={editingIngredient ? editingIngredient.fett : newIngredient.fett}
            onChange={(e) => handleInputChange(e, 'fett')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Gesättigte Fettsäuren (g)"
            variant="outlined"
            type="number"
            value={editingIngredient ? editingIngredient.gesaettigteFettsaeuren : newIngredient.gesaettigteFettsaeuren}
            onChange={(e) => handleInputChange(e, 'gesaettigteFettsaeuren')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Kohlenhydrate (g)"
            variant="outlined"
            type="number"
            value={editingIngredient ? editingIngredient.kohlenhydrate : newIngredient.kohlenhydrate}
            onChange={(e) => handleInputChange(e, 'kohlenhydrate')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Zucker (g)"
            variant="outlined"
            type="number"
            value={editingIngredient ? editingIngredient.zucker : newIngredient.zucker}
            onChange={(e) => handleInputChange(e, 'zucker')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Ballaststoffe (g)"
            variant="outlined"
            type="number"
            value={editingIngredient ? editingIngredient.ballaststoffe : newIngredient.ballaststoffe}
            onChange={(e) => handleInputChange(e, 'ballaststoffe')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Eiweiß (g)"
            variant="outlined"
            type="number"
            value={editingIngredient ? editingIngredient.eiweiss : newIngredient.eiweiss}
            onChange={(e) => handleInputChange(e, 'eiweiss')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Salz (g)"
            variant="outlined"
            type="number"
            value={editingIngredient ? editingIngredient.salz : newIngredient.salz}
            onChange={(e) => handleInputChange(e, 'salz')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <FormControl fullWidth style={{ marginBottom: 15 }}>
            <InputLabel>Allergene</InputLabel>
            <Select
              multiple
              value={selectedAllergenIds}
              onChange={(e) => setSelectedAllergenIds(e.target.value as number[])}
              label="Allergene"
            >
              {allergene.map((allergen) => (
                <MenuItem key={allergen.id} value={allergen.id}>
                  {allergen.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" className={styles.saveButton} onClick={editingIngredient ? () => handleSaveEdit(editingIngredient) : handleSaveIngredient}>
  Speichern
</Button>
        </Box>
      )}

       {!isFormVisible && (
      <List>
        {ingredients.map((ingredient) => (
          <div key={ingredient.id}>
            <ListItem>
              {/* Bild neben dem Zutaten-Namen */}
              <Avatar
                alt={ingredient.name}
                src={ingredient.foto || "/default-avatar.png"}
                style={{ width: 40, height: 40, marginRight: 10 }}
              />
              <ListItemText
                primary={ingredient.name}
                secondary={`Kalorien: ${ingredient.kcal} kcal`}
              />
              <Button
                className={styles.editZutatButton}
                onClick={() => handleEdit(ingredient.id)} // Bearbeiten
              >
                Bearbeiten
              </Button>
              <Button
                className={styles.deleteZutatButton}
                onClick={() => handleDelete(ingredient)} // Löschen
              >
                Löschen
              </Button>
              <Button
                onClick={() => handleOpenDialog(ingredient.id)}
                className={styles.imageButton}
              >
                Bild Hochladen
              </Button>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    )}

       {/* Upload Image Dialog */}
    {selectedZutatId && (
      <UploadImageZutat
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onUpload={handleUploadImage}
        zutatId={selectedZutatId}
      />
    )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={alertMessage.startsWith('Fehler') ? 'error' : 'success'}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Zutatenverwaltung;