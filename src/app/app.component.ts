import {Component} from 'angular2/core';
import {SubtenseClient} from '../app/common/subtense-client.component';
import {Alert} from  'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'main',
  template: `<alert type="info">ng2-bootstrap hello world!</alert><button class="btn btn-default">Submit Button</button><i class="fa fa-camera-retro fa-5x"></i> fa-5x <subtense-client></subtense-client>`,
  directives: [SubtenseClient, Alert]
})

export class AppComponent { }
