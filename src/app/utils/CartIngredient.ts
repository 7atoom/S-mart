export interface CartIngredient {
  productId: string;
  name: string;
  baseQuantity: number;
  quantityInGram: number;
  unit: string;
  price: number;
  image: string;
  selected: boolean;
}
