import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Services } from '../services/services';
import { FeaturedRentals } from '../featured-rentals/featured-rentals';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Services, FeaturedRentals],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
