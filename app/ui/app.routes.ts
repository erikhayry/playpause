import { provideRouter, RouterConfig } from '@angular/router';
import {AddStationComponent} from "./views/addStation.component";
import {RadioComponent} from "./views/radio.component";
import {TesterComponent} from "./views/tester.component";

export const routes: RouterConfig = [
  {
    path: '',
    redirectTo: '/play-station',
    pathMatch: 'full'
  },
  { path: 'play-station', component: RadioComponent },
  { path: 'add-station', component: AddStationComponent },
  { path: 'tester', component: TesterComponent }

];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
