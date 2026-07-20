import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Services } from '../services/services';
import { Testimonials } from '../testimonials/testimonials';
import { Owners } from '../owners/owners';
import { Footer } from '../footer/footer';
import { FeaturedRentals } from '../featured-rentals/featured-rentals';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Services, Testimonials, Owners, Footer, FeaturedRentals],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
