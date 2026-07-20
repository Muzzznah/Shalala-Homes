export interface Rental {
  id: number;
  title: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  image_url: string | null;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export type CreateRental = Omit<Rental, 'id' | 'created_at' | 'updated_at'>;

export type UpdateRental = Partial<CreateRental>;
