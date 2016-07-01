import { provideRouter, RouterConfig } from '@angular/router';
import {AddStationComponent} from "./views/addStation.component";
import {RadioComponent} from "./views/radio.component";

export const routes: RouterConfig = [
  { path: 'start', component: RadioComponent },
  { path: '', component: AddStationComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
