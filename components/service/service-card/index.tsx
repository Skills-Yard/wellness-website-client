"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import {
  Check,
  Clock3,
  Plus,
  Minus,
} from "lucide-react";

import type { ServiceItem } from "@/types/service-page";

interface ServiceCardProps {
  service: ServiceItem;
  quantity: number;
  onAdd: (service: ServiceItem) => void;
  onUpdateQuantity: (
    id: string,
    quantity: number
  ) => void;
}

function StarRating({
  rating,
  count,
}: {
  rating: number;
  count: number;
}) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span>⭐</span>
      <span className="font-medium">
        {rating}
      </span>
      <span className="text-muted-foreground">
        ({count.toLocaleString("en-IN")})
      </span>
    </div>
  );
}

export default function ServiceCard({
  service,
  quantity,
  onAdd,
  onUpdateQuantity,
}: ServiceCardProps) {
  const [isExpanded, setIsExpanded] =
    useState(false);

  const discount = Math.round(
    ((service.originalPrice -
      service.currentPrice) /
      service.originalPrice) *
      100
  );

  const isInCart = quantity > 0;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative h-56 md:h-auto md:w-64">
          <Image
            src={service.thumbnail.src}
            alt={service.thumbnail.alt}
            fill
            className="object-cover"
          />

          {service.badge && (
            <Badge className="absolute left-3 top-3">
              {service.badge}
            </Badge>
          )}

          {discount > 0 && (
            <Badge
              variant="secondary"
              className="absolute right-3 top-3"
            >
              {discount}% OFF
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-5">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {service.name}
            </h3>

            <StarRating
              rating={service.rating}
              count={service.reviewCount}
            />

            <p className="text-sm text-muted-foreground">
              {service.shortDescription}
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              {service.duration}
            </div>

            {isExpanded && (
              <ul className="space-y-2">
                {service.features.map(
                  (feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  )
                )}
              </ul>
            )}

            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() =>
                setIsExpanded(
                  !isExpanded
                )
              }
            >
              {isExpanded
                ? "Show Less"
                : "View Details"}
            </Button>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">
                    ₹
                    {service.currentPrice.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span className="text-sm line-through text-muted-foreground">
                    ₹
                    {service.originalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>

              {isInCart ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      onUpdateQuantity(
                        service.id,
                        quantity - 1
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-6 text-center font-medium">
                    {quantity}
                  </span>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      onAdd(service)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() =>
                    onAdd(service)
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}