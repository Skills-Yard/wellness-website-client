"use client";

import { ServiceCategory } from "@/types/service-page";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { ShieldCheck } from "lucide-react";

interface CategorySidebarProps {
  categories: ServiceCategory[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

export default function CategorySidebar({
  categories,
  activeCategory,
  onSelect,
}: CategorySidebarProps) {
  return (
    <div className="sticky top-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
            Categories
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <div key={category.id}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  onClick={() => onSelect(category.id)}
                  className={`
                    w-full h-auto justify-start py-3 transition-all
                    ${
                      isActive
                        ? "border border-primary/20 bg-primary/10"
                        : ""
                    }
                  `}
                >
                  <div className="flex w-full items-start gap-3">
                    <span className="text-lg">
                      {category.icon}
                    </span>

                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {category.name}
                        </span>

                        <Badge variant="secondary">
                          {category.serviceCount}
                        </Badge>
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
            );
          })}
        </CardContent>

        <div className="p-4 pt-0">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />

                <span className="text-sm font-semibold">
                  Verified Professionals
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                All 250+ therapists are background checked and certified.
              </p>
            </CardContent>
          </Card>
        </div>
      </Card>
    </div>
  );
}