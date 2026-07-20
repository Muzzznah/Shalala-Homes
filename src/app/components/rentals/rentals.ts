import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RentalService } from './rental.service';
import { Rental } from './rental.model';

const PHONE = '12269754568';

@Component({
  selector: 'app-rentals',
  imports: [],
  templateUrl: './rentals.html',
  styleUrl: './rentals.scss',
})
export class Rentals implements OnInit {
  private readonly rentalService = inject(RentalService);
  private readonly cdr = inject(ChangeDetectorRef);

  rentals: Rental[] = [];
  isLoading = true;
  errorMessage = '';

  /**
   * Load rentals when page opens
   */
  async ngOnInit(): Promise<void> {
    try {
      this.rentals = await this.rentalService.getRentals();
    } catch (error) {
      console.error('Failed to load rentals:', error);
      this.errorMessage = 'Unable to load rentals.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
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
