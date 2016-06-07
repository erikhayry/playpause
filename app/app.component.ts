import {Component} from '@angular/core';
import {WebviewComponent} from "./wv.component";

@Component({
    selector: 'pp-app',
    template: `
        <wv></wv>
    `,
    directives: [WebviewComponent]
})

export class AppComponent { }

