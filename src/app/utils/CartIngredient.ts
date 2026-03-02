export interface CartIngredient {
  productId: string;
  name: string;
  baseQuantity: number;    // requiredQuantity from API (grams needed for 2 servings)
  quantityInGram: number;  // grams per pack/piece from the product
  unit: string;
  price: number;
  image: string;
  selected: boolean;
}
