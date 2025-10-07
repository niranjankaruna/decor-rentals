import { Injectable } from '@angular/core';
import { Decor } from '../models/decor.model';


@Injectable({
  providedIn: 'root'
})
export class DecorService {
  private selectedDecor: Decor | null = null;

  setDecor(decor: Decor | null) {
    this.selectedDecor = decor;
  }

  getDecor(): Decor | null {
    return this.selectedDecor;
  }

  clearDecor() {
    this.selectedDecor = null;
  }
}