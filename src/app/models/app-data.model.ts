import { Category } from './category.model';
import { Product } from './product.model';
import { Decor } from './decor.model';
import { EventItem } from './event.model';

export interface AppData {
  Categories?: Category[];
  Products?: Product[];
  Decors?: Decor[];
  Events?: EventItem[];
  [key: string]: any; // future sheets
}
