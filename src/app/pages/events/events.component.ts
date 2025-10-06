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
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: EventItem[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      this.events = data.Events || [];
    });
  }
}