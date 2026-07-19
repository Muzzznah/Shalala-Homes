import {Component} from '@angular/core';
import {Hero} from '../hero/hero';
import {About} from '../about/about';
import {Services} from '../services/services';
import {Owners} from '../owners/owners';
import {Testimonials} from '../testimonials/testimonials';
import {Contact} from '../contact/contact';
import {Footer} from '../footer/footer';
import {FeaturedRentals} from '../featured-rentals/featured-rentals';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Services, Owners, Testimonials, Contact, FeaturedRentals],
  templateUrl: './home.html',
})
export class Home {}
