import { provideRouter, RouterConfig } from '@angular/router';
import {WebviewComponent} from "./wv.component";
import {AddStationComponent} from "./addStation.component";

export const routes: RouterConfig = [
  { path: '', component: WebviewComponent },
  { path: 'add-station', component: AddStationComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
