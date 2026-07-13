import { Category, DynamicService } from "@/src/utils/types/spabooking";
import SpotlightServiceCard from "./Spotlightservicecard";
import StandardServiceCard from "./Standardservicecard";


interface ServicesListProps {
  categories: Category[];
  services: DynamicService[];
  onDetailClick: (service: DynamicService) => void;
  onAddToCart: (service: DynamicService) => void;
}

export default function ServicesList({
  categories,
  services,
  onDetailClick,
  onAddToCart,
}: ServicesListProps) {
  return (
    <div className="space-y-8 xs:space-y-10 md:space-y-12 flex-1">
      {categories.map((category) => {
        const categoryServices = services.filter(
          (s) => s.category === category.name,
        );

        if (categoryServices.length === 0) return null;

        return (
          <div
            key={category.id}
            id={category.id}
            className="space-y-4 xs:space-y-6 scroll-mt-24 lg:scroll-mt-32"
          >
            <h2 className="text-base xs:text-lg sm:text-xl font-bold text-[#000000] border-b border-[#F3EFEB] pb-2 xs:pb-3 leading-tight">
              {category.name}
            </h2>

            <div className="space-y-6 xs:space-y-8">
              {categoryServices.map((service, index) => {
                const isSpotlightMobile = index === 0 || service.isSpotlight;

                return (
                  <div
                    onClick={() => onDetailClick(service)}
                    key={service.id}
                    className="cursor-pointer transition-opacity active:opacity-90 block group/item"
                  >
                    {/* MOBILE LAYOUT */}
                    <div className="flex flex-col lg:hidden w-full">
                      {isSpotlightMobile ? (
                        <SpotlightServiceCard
                          service={service}
                          layout="mobile"
                          onDetailClick={onDetailClick}
                          onAddToCart={onAddToCart}
                        />
                      ) : (
                        <StandardServiceCard
                          service={service}
                          layout="mobile"
                          onDetailClick={onDetailClick}
                          onAddToCart={onAddToCart}
                        />
                      )}
                    </div>

                    {/* DESKTOP LAYOUT */}
                    <div className="hidden lg:block w-full">
                      {service.isSpotlight ? (
                        <SpotlightServiceCard
                          service={service}
                          layout="desktop"
                          onDetailClick={onDetailClick}
                          onAddToCart={onAddToCart}
                        />
                      ) : (
                        <StandardServiceCard
                          service={service}
                          layout="desktop"
                          onDetailClick={onDetailClick}
                          onAddToCart={onAddToCart}
                        />
                      )}
                    </div>

                    {index !== categoryServices.length - 1 && (
                      <div className="mt-4 xs:mt-6 mb-6 xs:mb-8 h-px w-full bg-[#F3EFEB]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}