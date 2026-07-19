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

  /** Per-listing carousel position: rental id -> current photo index */
  protected readonly photoIndex = signal<Record<number, number>>({});
  /** Touch-swipe tracking: rental id -> touchstart X */
  private touchStartX: Record<number, number> = {};

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

  /** All photos for a listing: the gallery array, falling back to the cover */
  photos(r: Rental): string[] {
    if (r.image_urls && r.image_urls.length > 0) return r.image_urls;
    return r.image_url ? [r.image_url] : [];
  }

  /** Current carousel position for a listing (defaults to 0) */
  indexOf(r: Rental): number {
    return this.photoIndex()[r.id] ?? 0;
  }

  /** Step the carousel; wraps around at both ends */
  step(r: Rental, delta: number): void {
    const count = this.photos(r).length;
    if (count < 2) return;
    const next = (this.indexOf(r) + delta + count) % count;
    this.photoIndex.update(m => ({ ...m, [r.id]: next }));
  }

  /** Jump straight to a photo (dot indicators) */
  goTo(r: Rental, i: number): void {
    this.photoIndex.update(m => ({ ...m, [r.id]: i }));
  }

  /** Touch swipe: record start X, then step on release if moved far enough */
  onTouchStart(r: Rental, e: TouchEvent): void {
    this.touchStartX[r.id] = e.touches[0].clientX;
  }

  onTouchEnd(r: Rental, e: TouchEvent): void {
    const startX = this.touchStartX[r.id];
    if (startX === undefined) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) this.step(r, dx < 0 ? 1 : -1);
    delete this.touchStartX[r.id];
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
