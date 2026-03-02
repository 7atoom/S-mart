export interface AddProductBody {
  title: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  unit?: string;
  quantityInGram?: number;
  featured?: boolean;
}
