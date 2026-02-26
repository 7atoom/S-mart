import {Category} from './Category';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  unit: string;
  __v: number;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
