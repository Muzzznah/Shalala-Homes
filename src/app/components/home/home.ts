import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Services } from '../services/services';
import { Nav } from '../nav/nav';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Services, Nav],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
