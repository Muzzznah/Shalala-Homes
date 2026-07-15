import { Component } from '@angular/core';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})

export class Nav {

  protected readonly links: NavLink[] = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Rentals', href: '/rentals' },
    { label: 'For Owners', href: '#owners' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];


}
