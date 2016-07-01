import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {WebviewComponent} from "./wv.component";

@Component({
  selector: 'pp-app',
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES]
})
export class AppComponent {
}
