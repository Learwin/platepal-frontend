import React, { useState } from 'react';
import { Recipe } from './services/api';

interface RecipeFormProps {
  onSave: (recipe: Recipe) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSave }) => {
  const [newRecipe, setNewRecipe] = useState<Recipe>({
    id: 0,
    name: '',
    anweisungen: '',
    zeit: 0,
    schwierigkeit: 0,
    defaultPortionen: 0,
    foto: '',
    timer: [],
    user_Id: { id: 0, username: '', passwort: '', emailAdresse: '', foto: '' },
    durchschnittlicheBewertung: 0,
    flag: 0,
    zutaten: [],
  });

  const handleSave = async () => {
    //const savedRecipe = await saveRecipe(newRecipe);
    //onSave(savedRecipe);
    setNewRecipe({ ...newRecipe, name: '', anweisungen: '' });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Rezeptname"
        value={newRecipe.name}
        onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })}
      />
      <button onClick={handleSave}>Speichern</button>
    </div>
  );
};

export default RecipeForm;
