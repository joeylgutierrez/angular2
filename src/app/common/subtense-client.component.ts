import {Component} from 'angular2/core';

@Component({
  selector: 'subtense-client',
  templateUrl: 'app/common/subtense-client.html'
})

export class SubtenseClient {

  constructor() {
    console.info('SubtenseClient Component Mounted Successfully');
  }

}
