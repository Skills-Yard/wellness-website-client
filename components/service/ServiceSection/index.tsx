import type {
  ServiceItem,
  ServiceCategory,
} from "@/types/service-page";

import ServiceCard from "../service-card";

interface ServiceSectionProps {
  category: ServiceCategory;
  services: ServiceItem[];
  getQuantity: (id: string) => number;
  onAdd: (service: ServiceItem) => void;
  onUpdateQuantity: (
    id: string,
    qty: number
  ) => void;
}

export default function ServiceSection({
  category,
  services,
  getQuantity,
  onAdd,
  onUpdateQuantity,
}: ServiceSectionProps) {
  if (services.length === 0) return null;

  return (
    <section
      id={`category-${category.id}`}
      className="scroll-mt-32 space-y-6"
    >
      {/* Category Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">
          {category.icon}
        </span>

        <div>
          <h2 className="text-2xl font-bold">
            {category.name}
          </h2>

          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {services.length} Services Available
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            quantity={getQuantity(service.id)}
            onAdd={onAdd}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </div>
    </section>
  );
}