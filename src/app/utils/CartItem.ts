export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  title: string;
  price: number;
  weight: string;
  image: string;
  quantity: number;
  [key: string]: any;
}
