import { Routes } from '@angular/router';
import { EventsComponent } from './pages/events/events.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: EventsComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
];
