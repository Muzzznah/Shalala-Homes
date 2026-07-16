import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Nav} from './components/nav/nav';
import {Hero} from './components/hero/hero';
import {About} from './components/about/about';
import {Services} from './components/services/services';

/* APP ROOT — Shalala Homes single-page layout
   Section order (matches prototype):
   Nav -> Hero -> About -> Services
   -> [For Owners: Hadi] -> [Contact: Xingbo] -> [Footer: Hadi] */

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Hero, About, Services],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {}
