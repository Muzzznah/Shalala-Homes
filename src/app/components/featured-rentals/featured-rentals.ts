import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RentalService } from '../rentals/rental.service';
import { Rental } from '../rentals/rental.model';

const PHONE = '12269754568';

@Component({
  selector: 'app-featured-rentals',
  imports: [RouterLink],
  templateUrl: './featured-rentals.html',
  styleUrl: './featured-rentals.scss',
})
export class FeaturedRentals implements OnInit {
  private readonly rentalService = inject(RentalService);

  protected readonly featured = signal<Rental[]>([]);

  /**
   * Load the three newest rentals
   */
  async ngOnInit(): Promise<void> {
    try {
      const rentals = await this.rentalService.getRentals();
      this.featured.set(rentals.slice(0, 3));
    } catch (error) {
      console.error('Failed to load featured rentals:', error);
      this.featured.set([]);
    }
  }

  /**
   * Create autofilled message for selected rental
   * @param rental
   */
  private message(rental: Rental): string {
    return encodeURIComponent(
      `Hi Shalala Homes, I'm interested in the ${rental.address} listing. Could you send more photos?`,
    );
  }

  /**
   * Create WhatsApp link for selected rental
   * @param rental
   */
  waLink(rental: Rental): string {
    return `https://wa.me/${PHONE}?text=${this.message(rental)}`;
  }

  /**
   * Create SMS link for selected rental
   * @param rental
   */
  smsLink(rental: Rental): string {
    return `sms:+${PHONE}?body=${this.message(rental)}`;
  }
}
