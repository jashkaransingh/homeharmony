import React from "react";
import type { Listing } from "../types/listing";

interface Props {
  listing: Listing;
  onClick: (listing: Listing) => void;
}

export function ListingCard({ listing, onClick }: Props) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(listing)}
    >
      {listing.photos.length > 0 && (
        <div className="h-48 bg-gray-100">
          <img
            src={listing.photos[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {listing.title}
          </h3>
          <span className="text-green-600 font-bold text-sm whitespace-nowrap ml-2">
            ${listing.price_per_month}/mo
          </span>
        </div>
        <p className="text-gray-500 text-xs mt-1">{listing.address}</p>
        <div className="flex items-center gap-2 mt-3">
          {listing.walk_score !== null && (
            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
              Walk {listing.walk_score}
            </span>
          )}
          {listing.lease_verified && (
            <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
              Verified
            </span>
          )}
          <span className="text-gray-400 text-xs ml-auto">
            {listing.owner.full_name}
          </span>
        </div>
      </div>
    </div>
  );
}
