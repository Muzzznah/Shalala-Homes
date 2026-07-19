import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { RentalService } from './services/rental.service';
import { Rental } from './services/rental.model';

/* ============================================================
   RENTALS — public listings page (matches the prototype)
   - Dark banner header
   - Area filter pills derived from each rental's city
   - Poster card grid (866:1000) with placeholder design
   - WhatsApp / iMessage buttons pre-filled per address
   - Data comes live from Supabase via RentalService
   ============================================================ */

const PHONE = '12269754568';

/** Filter pill definitions — areaKey groups cities like the prototype */
const FILTERS = [
  { key: 'all', label: 'All Areas', match: (_c: string) => true },
  { key: 'west', label: 'West & South Windsor', match: (c: string) => /west|south/i.test(c) },
  { key: 'downtown', label: 'Downtown & Walkerville', match: (c: string) => /downtown|walkerville/i.test(c) },
  { key: 'lasalle', label: 'LaSalle', match: (c: string) => /lasalle/i.test(c) },
  { key: 'amherstburg', label: 'Amherstburg', match: (c: string) => /amherstburg/i.test(c) },
] as const;

@Component({
  selector: 'app-rentals',
  imports: [],
  templateUrl: './rentals.html',
  styleUrl: './rentals.scss',
})
export class Rentals implements OnInit {
  private readonly rentalService = inject(RentalService);

  protected readonly filters = FILTERS;
  protected readonly activeFilter = signal<string>('all');

  protected readonly rentals = signal<Rental[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);

  /** Rentals narrowed by the active area pill */
  protected readonly visible = computed(() => {
    const f = FILTERS.find(x => x.key === this.activeFilter()) ?? FILTERS[0];
    return this.rentals().filter(r => f.match(r.city));
  });

  async ngOnInit(): Promise<void> {
    try {
      this.rentals.set(await this.rentalService.getRentals());
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  setFilter(key: string): void {
    this.activeFilter.set(key);
  }

  /** WhatsApp deep link with a pre-filled message about this address */
  waLink(r: Rental): string {
    const msg = encodeURIComponent(
      `Hi Shalala Homes, I'm interested in the ${r.address} listing. Could you send more photos?`,
    );
    return `https://wa.me/${PHONE}?text=${msg}`;
  }

  /** SMS / iMessage link with the same pre-filled message */
  smsLink(r: Rental): string {
    const msg = encodeURIComponent(
      `Hi Shalala Homes, I'm interested in the ${r.address} listing. Could you send more photos?`,
    );
    return `sms:+${PHONE}?&body=${msg}`;
  }
}
