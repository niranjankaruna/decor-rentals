import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Decor } from '../../models/decor.model';
import { EventItem } from '../../models/event.model';
import { DataService } from '../../services/data.service';
import { DecorService } from '../../services/decor.service';
import { EventService } from  '../../services/event.service';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [
      CommonModule,          // <-- needed for *ngIf, *ngFor
      HttpClientModule       // <-- needed to use DataService with HttpClient
  ],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent implements OnInit {

  decors: Decor[] = [];
  selectedEvent: EventItem | null = null;

    constructor(
    private dataService: DataService,
    private decorService: DecorService,
    private eventService: EventService
  ) {}

  async ngOnInit() {
  // Wait for the API call
  const data = await firstValueFrom(this.dataService.getData());
  
  const allDecors = data.Decors || [];

  // Now you can safely use allDecors without nesting
  this.processDecors(allDecors);
  }

  processDecors(allDecors: any[]) {
    const selectedEvent = this.eventService.getEvent();

    if (selectedEvent && selectedEvent['Decors']) {
      const decorIds = selectedEvent['Decors']
        .split(',')
        .map((id: string) => id.trim())
        .filter((id: string) => id !== '');

      this.decors = allDecors.filter(decor =>
        decor['DecorReference'] && decorIds.includes(decor['DecorReference'].toString())
      );
    } else {
      this.decors = allDecors; // show all if no event
    }
  }
    /**
   * Return a thumbnail image for an event (first ImageLocal) or undefined.
   */
  getThumbnail(decor: Decor): string | undefined {
    if (!decor) return undefined;
    const imgs = decor['ImageLocal'];
    if (Array.isArray(imgs) && imgs.length) return imgs[0];
    return undefined;
  }
}
