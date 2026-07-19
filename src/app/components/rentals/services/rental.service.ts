import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../core/supabase.service';
import { Rental, CreateRental, UpdateRental } from './rental.model';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  private readonly supabase = inject(SupabaseService).client;

  /**
   * Get all rentals from the rentals table
   */
  async getRentals(): Promise<Rental[]> {
    const { data, error } = await this.supabase
      .from('rentals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Rental[];
  }

  /**
   * Get rental by id from the rentals table
   * @param id
   */
  async getRental(id: number): Promise<Rental> {
    const { data, error } = await this.supabase.from('rentals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as Rental;
  }

  /**
   * Create rental and write to rentals table
   * @param rental
   */
  async createRental(rental: CreateRental): Promise<Rental> {
    const { data, error } = await this.supabase
      .from('rentals')
      .insert(rental)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Rental;
  }

  /**
   * Update rental and write to rentals table
   * @param id
   * @param changes
   */
  async updateRental(id: number, changes: UpdateRental): Promise<Rental> {
    const { data, error } = await this.supabase
      .from('rentals')
      .update({...changes})
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Rental;
  }

  /**
   * Delete rental and write to rentals table
   * @param id
   */
  async deleteRental(id: number): Promise<void> {
    const { error } = await this.supabase.from('rentals').delete().eq('id', id);

    if (error) {
      throw error;
    }
  }
}
