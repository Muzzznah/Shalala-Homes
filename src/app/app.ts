import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './components/nav/nav';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Services } from './components/services/services';
import { Contact } from './components/contact/contact';
import { Owners } from './components/owners/owners';
import { Testimonials } from './components/testimonials/testimonials';
import { Footer } from './components/footer/footer';

/* APP ROOT — Shalala Homes single-page layout
   Section order (matches prototype):
   Nav -> Hero -> About -> Services -> Owners -> Testimonials -> Footer */

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Hero, About, Services, Owners, Testimonials, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
