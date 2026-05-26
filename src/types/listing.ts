export interface Listing {
  id: string;
  created_at: string;
  owner_id: string;
  title: string;
  description: string;
  price_per_month: number;
  address: string;
  latitude: number;
  longitude: number;
  walk_score: number | null;
  photos: string[];
  available_from: string;
  lease_verified: boolean;
  owner: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface Message {
  id: string;
  created_at: string;
  listing_id: string;
  sender_id: string;
  content: string;
  sender: {
    full_name: string;
  };
}
