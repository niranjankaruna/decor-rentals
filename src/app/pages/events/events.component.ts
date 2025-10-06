import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';   // <-- import this
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { EventItem } from '../../models/event.model';


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,          // <-- needed for *ngIf, *ngFor
    HttpClientModule       // <-- needed to use DataService with HttpClient
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: EventItem[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      this.events = data.Events || [];
    });
  }

  /**
   * Return a thumbnail image for an event (first ImageLocal) or undefined.
   */
  getThumbnail(event: EventItem): string | undefined {
    if (!event) return undefined;
    const imgs = event['ImageLocal'];
    if (Array.isArray(imgs) && imgs.length) return imgs[0];
    return undefined;
  }
}