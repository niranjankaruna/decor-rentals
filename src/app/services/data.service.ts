import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AppData } from '../models/app-data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private jsonUrl = 'assets/data.json';
  private cache$: Observable<AppData> | null = null;

  constructor(private http: HttpClient) {}

  getData(): Observable<AppData> {
    if (!this.cache$) {
      this.cache$ = this.http.get<AppData>(this.jsonUrl).pipe(
        shareReplay(1) // caches the response
      );
    }
    return this.cache$;
  }
}
