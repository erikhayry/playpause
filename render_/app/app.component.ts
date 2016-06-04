import {Component} from '@angular/core';
import {WebviewComponent} from "./wv.component";

@Component({
    selector: 'my-app',
    template: `
        <h1>play / pause</h1>
        <wv></wv>
    `,
  directives: [WebviewComponent]
})

export class AppComponent { }

