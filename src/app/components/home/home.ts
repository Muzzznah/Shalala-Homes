import {Component} from '@angular/core';
import {Hero} from '../hero/hero';
import {About} from '../about/about';
import {Services} from '../services/services';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Services],
  templateUrl: './home.html',
})
export class Home {}
