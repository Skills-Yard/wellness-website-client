"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceHeaderProps {
  title: string;
  subtitle: string;
  image: string;
  rating: number;
  reviews: string;
  bookings: string;
  duration: string;
  price: number;
}

export default function ServiceHeader({
  title,
  subtitle,
  image,
  rating,
  reviews,
  bookings,
  duration,
  price,
}: ServiceHeaderProps) {
  return (
    <section className="relative min-h-[500px] overflow-hidden rounded-3xl">
      <Image
        src={image}
        alt={title}
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      <div className="relative z-10 flex min-h-[500px] flex-col justify-end p-6 md:p-10">
        <Badge className="mb-4 w-fit">
          Home Service Available
        </Badge>

        <h1 className="max-w-3xl text-3xl font-bold text-white md:text-5xl">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-base text-gray-200 md:text-lg">
          {subtitle}
        </p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-200">
          <span>⭐ {rating}</span>
          <span>{reviews}</span>
          <span>{bookings}</span>
          <span>{duration}</span>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-300">
              Starting From
            </p>

            <h2 className="text-3xl font-bold text-white">
              ₹{price}
            </h2>
          </div>

          <Button size="lg">
            Book Now
          </Button>

          <Button
            size="lg"
            variant="secondary"
          >
            View Services
          </Button>
        </div>
      </div>
    </section>
  );
}