import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EventService } from '../../services/event.service';
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

  constructor(
    private router: Router,
    private dataService: DataService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    //Get all events from data service
    this.dataService.getData().subscribe(data => {
      this.events = data.Events || [];
    });
  }

   onEventClick(event: EventItem) {
    this.eventService.setEvent(event);
    this.router.navigate(['/collections']);
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