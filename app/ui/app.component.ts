import {Component, Type} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {RadioComponent} from "./views/radio.component";
import {AddStationComponent} from "./views/addStation.component";

@Component({
  selector: 'pp-app',
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  precompile: [RadioComponent, AddStationComponent]
})
export class AppComponent extends Type {}
