import React, { useEffect, useState } from 'react';
import RecipeList from './ReceipList';
import RecipeForm from './ReceipForm';
import { loadRecipesForUser } from './services/receipeService';
import { useAuth } from './context/AuthContextType';
import { Recipe } from './services/api';

const Rezeptverwaltung = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const userRecipes = await loadRecipesForUser(user.id);
        setRecipes(userRecipes);
      }
    };
    loadData();
  }, [user]);

  return (
    <div>
      <h1>Rezeptverwaltung</h1>
      <RecipeList recipes={recipes} />
      <RecipeForm onSave={newRecipe => setRecipes([...recipes, newRecipe])} />
    </div>
  );
};

export default Rezeptverwaltung;
