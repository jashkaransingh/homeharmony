import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Listing } from "../types/listing";

export function useListings(filters?: { minPrice?: number; maxPrice?: number }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      let query = supabase
        .from("listings")
        .select(`
          *,
          owner:profiles(full_name, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (filters?.minPrice !== undefined) {
        query = query.gte("price_per_month", filters.minPrice);
      }
      if (filters?.maxPrice !== undefined) {
        query = query.lte("price_per_month", filters.maxPrice);
      }

      const { data, error } = await query;
      if (error) {
        setError(error.message);
      } else {
        setListings(data ?? []);
      }
      setLoading(false);
    }

    fetchListings();
  }, [filters?.minPrice, filters?.maxPrice]);

  return { listings, loading, error };
}
