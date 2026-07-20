import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RentalService } from './rental.service';
import { Rental } from './rental.model';

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
}
