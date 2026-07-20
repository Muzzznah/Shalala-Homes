import { Component } from '@angular/core';

// Footer — shared across all pages
// 4 columns: brand+social, explore links, service areas, contact

interface FooterLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly year = new Date().getFullYear();

  protected readonly phoneDisplay = '(226) 975-4568';
  protected readonly phoneHref = 'tel:+12269754568';
  protected readonly email = 'shalalahomes@gmail.com';

  protected readonly facebookUrl = 'https://www.facebook.com/share/184kgNinpF/?mibextid=wwXIfr';
  protected readonly instagramUrl = 'https://www.instagram.com/shalala_homes?igsh=cG94OGp6eng2N2d3';
  protected readonly whatsappUrl = 'https://wa.me/12269754568';

  protected readonly exploreLinks: FooterLink[] = [
    { label: 'Home', href: '#home' },
    { label: 'Rentals', href: '/rentals' },
    { label: 'Services', href: '#services' },
    { label: 'For Owners', href: '#owners' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  protected readonly serviceAreas: string[] = [
    'West Windsor',
    'Downtown Windsor',
    'LaSalle',
    'Amherstburg',
  ];
}
