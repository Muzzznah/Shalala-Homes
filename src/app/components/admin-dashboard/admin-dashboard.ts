import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RentalService } from '../rentals/services/rental.service';
import { Rental } from '../rentals/services/rental.model';
import { AuthService } from '../../core/auth.service';

/* ============================================================
   ADMIN DASHBOARD — full CRUD over the rentals table.
   - Table of all listings
   - One form used for both Add and Edit (editingId decides)
   - Delete with a confirm step
   All operations go through RentalService (Supabase).
   ============================================================ */

@Component({
  selector: 'app-admin-dashboard',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly rentalService = inject(RentalService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly rentals = signal<Rental[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorMsg = signal<string | null>(null);

  /** null = the form adds a new rental; a number = editing that id */
  protected readonly editingId = signal<number | null>(null);
  /** id awaiting delete confirmation (two-click delete) */
  protected readonly confirmingDelete = signal<number | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    province: ['ON', Validators.required],
    postal_code: [''],
    image_url: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  private async refresh(): Promise<void> {
    this.loading.set(true);
    this.errorMsg.set(null);
    try {
      this.rentals.set(await this.rentalService.getRentals());
    } catch {
      this.errorMsg.set('Could not load listings.');
    } finally {
      this.loading.set(false);
    }
  }

  /** Put a rental's values into the form for editing */
  startEdit(r: Rental): void {
    this.editingId.set(r.id);
    this.form.setValue({
      title: r.title,
      address: r.address,
      city: r.city,
      province: r.province,
      postal_code: r.postal_code,
      image_url: r.image_url ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ province: 'ON' });
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.errorMsg.set(null);

    const value = this.form.getRawValue();
    const payload = { ...value, image_url: value.image_url || null };

    try {
      const id = this.editingId();
      if (id === null) {
        await this.rentalService.createRental(payload);
      } else {
        await this.rentalService.updateRental(id, payload);
      }
      this.cancelEdit();
      await this.refresh();
    } catch {
      this.errorMsg.set('Save failed — check the fields and try again.');
    } finally {
      this.saving.set(false);
    }
  }

  /** First click arms the confirmation; second click deletes */
  async onDelete(id: number): Promise<void> {
    if (this.confirmingDelete() !== id) {
      this.confirmingDelete.set(id);
      return;
    }
    this.confirmingDelete.set(null);
    try {
      await this.rentalService.deleteRental(id);
      await this.refresh();
    } catch {
      this.errorMsg.set('Delete failed.');
    }
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/admin']);
  }
}
