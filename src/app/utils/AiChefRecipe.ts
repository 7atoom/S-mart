import { Product } from './Product';

export interface RecipeIngredient {
  found: boolean;
  requiredQuantity: number;
  title?: string;
  product?: Product;
}

export interface AiChefRecipeResponse {
  message: string;
  recipe: RecipeIngredient[];
}

