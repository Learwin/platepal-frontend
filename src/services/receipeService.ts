// recipeService.ts
import { fetchRezepte, postRezept, updateRezept, deleteRezepte, fetchEinheiten, fetchZutatenListe, Recipe } from '../services/api';

export const loadRecipesForUser = async (userId: number) => {
  const recipes = await fetchRezepte();
  return recipes.filter(recipe => recipe.user_Id.id === userId);
};

export const saveRecipe = async (recipe: Recipe) => {
  return recipe.id === 0 ? await postRezept(recipe) : await updateRezept(recipe);
};

export const deleteRecipeById = async (id: number) => {
  return await deleteRezepte(id);
};

export const loadEinheiten = async () => await fetchEinheiten();

export const loadZutaten = async () => await fetchZutatenListe();
