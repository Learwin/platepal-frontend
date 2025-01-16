import React from 'react';
import { Recipe } from './services/api';


interface RecipeListProps {
  recipes: Recipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  return (
    <div>
      <h2>Rezepte</h2>
      {recipes.map(recipe => (
        <div key={recipe.id}>
          <h3>{recipe.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
