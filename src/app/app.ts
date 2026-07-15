import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Nav} from './components/nav/nav';

/* APP ROOT — Shalala Homes single-page layout
   Section order (matches prototype):
   Nav -> Hero -> About -> Services
   -> [For Owners: Hadi] -> [Contact: Xingbo] -> [Footer: Hadi] */

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {}
