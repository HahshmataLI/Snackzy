import { Category } from "./category.model";

export interface Item {
  _id: string;
  name: string;
  price: number;
  image: string;
  available: boolean;
  category: string | Category;
}
