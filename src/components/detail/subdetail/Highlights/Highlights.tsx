import { CheckCircle2, Sparkles } from "lucide-react";

interface HighlightsProps {
  service: any;
}

export default function Highlights({ service }: HighlightsProps) {
  if (!service) return null;

  const highlights = service.features || [];

  return (
    <section className="mx-auto w-full border-b border-slate-100 bg-white px-6 py-8 sm:py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 border border-amber-100">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Highlights
            </span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              What's included in the session
            </h2>
            <p className="text-sm text-slate-500">
              Everything you need for a complete and premium relaxation experience
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-3 sm:gap-4">
          {highlights.map((text: string, index: number) => (
            <div
              key={`${text}-${index}`}
              className="group flex gap-4 items-start p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-50/50 border border-slate-100 transition-all duration-300 hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-sm"
            >
              {/* Icon */}
              <div className="relative flex-shrink-0 mt-1">
                <div className="absolute inset-0 bg-amber-500/20 rounded-lg blur-sm group-hover:bg-amber-500/30 transition-colors" />
                <CheckCircle2 className="w-5 h-5 text-amber-600 relative z-10 transition-transform group-hover:scale-110" />
              </div>
              
              {/* Text */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium flex-1 pt-0.5">
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Optional Bottom Message */}
        <div className="pt-2 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs sm:text-sm text-blue-700 font-medium">
            ✓ All services use premium, hypoallergenic products safe for all skin types
          </p>
        </div>
      </div>
    </section>
  );
}