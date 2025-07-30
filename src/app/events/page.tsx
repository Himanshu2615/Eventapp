// app/events/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import React from "react";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Tier ranking logic
const tierRank = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
};

export default async function EventsPage() {
  const user = await currentUser();

  const userTier = user?.privateMetadata?.tier as keyof typeof tierRank || "free";

  const { data: events, error } = await supabase.from("events").select("*");

  if (error) {
    return <div className="text-red-600 p-4">Error: {error.message}</div>;
  }

  type Event = {
    id: string | number;
    title: string;
    description: string;
    image_url?: string;
    event_date: string;
    tier: keyof typeof tierRank;
    [key: string]: any;
  };

  const visibleEvents = (events as Event[] | undefined)?.filter(
    (event) => tierRank[event.tier] <= tierRank[userTier]
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events for {userTier.toUpperCase()} Tier</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {visibleEvents?.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-md p-4">
            <img
              src={event.image_url || "https://via.placeholder.com/300x150"}
              alt={event.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-600">{event.description}</p>
            <p className="text-xs mt-1 text-gray-500">
              {new Date(event.event_date).toDateString()}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold text-white ${
                event.tier === "free"
                  ? "bg-gray-500"
                  : event.tier === "silver"
                  ? "bg-blue-500"
                  : event.tier === "gold"
                  ? "bg-yellow-500"
                  : "bg-purple-700"
              }`}
            >
              {event.tier.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
