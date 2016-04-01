/**
 * Created by joeylgutierrez on 3/26/16.
 */
import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from '../app/app.component'
import {enableProdMode} from 'angular2/core';
import {ROUTER_PROVIDERS} from "angular2/router";
import {HTTP_PROVIDERS} from "angular2/http";

enableProdMode();

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS
]);
