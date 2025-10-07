import { Injectable } from '@angular/core';
import { EventItem } from '../models/event.model';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private selectedEvent: EventItem | null = null;

  setEvent(event: EventItem | null) {
    this.selectedEvent = event;
  }

  getEvent(): EventItem | null {
    return this.selectedEvent;
  }

  clearEvent() {
    this.selectedEvent = null;
  }
}
