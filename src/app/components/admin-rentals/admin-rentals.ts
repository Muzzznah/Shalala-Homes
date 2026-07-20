import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { RentalService } from '../rentals/rental.service';
import { CreateRental, Rental, UpdateRental } from '../rentals/rental.model';

@Component({
  selector: 'app-admin-rentals',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-rentals.html',
  styleUrl: './admin-rentals.scss',
})
export class AdminRentals implements OnInit {
  private readonly rentalService = inject(RentalService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  rentals: Rental[] = [];
  editingRentalId: number | null = null;

  selectedImage: File | null = null;

  isLoading = true;
  isSubmitting = false;

  errorMessage = '';
  successMessage = '';

  readonly rentalForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    province: ['Ontario', Validators.required],
    postal_code: ['', Validators.required],
    image_url: [''],
  });

  /**
   * Load rentals when page opens
   */
  async ngOnInit(): Promise<void> {
    console.log('ngOnInit running');
    await this.loadRentals();
  }

  /**
   * Get all rentals from rentals table
   */
  async loadRentals(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.rentals = await this.rentalService.getRentals();
      console.log('Rentals loaded:', this.rentals);
    } catch (error) {
      console.error('Failed to load rentals:', error);
      this.errorMessage = 'Unable to load rentals.';
    } finally {
      this.isLoading = false;

      // Tell Angular that async data changed
      this.cdr.markForCheck();
    }
  }

  /**
   * Create or update rental
   */
  async submit(): Promise<void> {
    if (this.rentalForm.invalid || this.isSubmitting) {
      this.rentalForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const formValue = this.rentalForm.getRawValue();

      let imageUrl = formValue.image_url || null;

      if (this.selectedImage) {
        imageUrl = await this.rentalService.uploadRentalImage(this.selectedImage);
      }

      const rentalData: CreateRental = {
        ...formValue,
        image_url: imageUrl,
      };

      if (this.editingRentalId === null) {
        await this.rentalService.createRental(rentalData);
        this.successMessage = 'Rental created successfully.';
      } else {
        const changes: UpdateRental = rentalData;

        await this.rentalService.updateRental(this.editingRentalId, changes);

        this.successMessage = 'Rental updated successfully.';
      }

      this.selectedImage = null;
      this.cancelEdit();
      await this.loadRentals();
    } catch (error) {
      console.error('Failed to save rental:', error);
      this.errorMessage = 'Unable to save rental.';
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }

  /**
   * Store selected rental image
   * @param event
   */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedImage = null;
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select an image file.';
      input.value = '';
      this.selectedImage = null;
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      this.errorMessage = 'Image must be smaller than 5 MB.';
      input.value = '';
      this.selectedImage = null;
      return;
    }

    this.errorMessage = '';
    this.selectedImage = file;
  }

  /**
   * Fill form with selected rental
   * @param rental
   */
  editRental(rental: Rental): void {
    this.editingRentalId = rental.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.rentalForm.setValue({
      title: rental.title,
      address: rental.address,
      city: rental.city,
      province: rental.province,
      postal_code: rental.postal_code,
      image_url: rental.image_url ?? '',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /**
   * Stop editing and clear form
   */
  cancelEdit(): void {
    this.editingRentalId = null;
    this.selectedImage = null;

    const imageInput = document.getElementById('rental-image') as HTMLInputElement | null;

    if (imageInput) {
      imageInput.value = '';
    }

    this.rentalForm.reset({
      title: '',
      address: '',
      city: '',
      province: 'Ontario',
      postal_code: '',
      image_url: '',
    });
  }

  /**
   * Delete rental from rentals table
   * @param rental
   */
  async deleteRental(rental: Rental): Promise<void> {
    const confirmed = window.confirm(`Delete "${rental.title}"?`);

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.rentalService.deleteRental(rental.id);
      this.successMessage = 'Rental deleted successfully.';
      await this.loadRentals();
    } catch (error) {
      console.error('Failed to delete rental:', error);
      this.errorMessage = 'Unable to delete rental.';
    } finally {
      this.cdr.markForCheck();
    }
  }
}
