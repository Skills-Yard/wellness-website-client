import Image from "next/image";

interface HighlightsProps {
  service: any;
}

export default function Highlights({ service }: HighlightsProps) {
  if (!service) return null;

  const highlights = service.features || [];

  return (
    <section className="mx-auto max-w-6xl px-0 pt-1 pb-1 sm:px-0 lg:px-0">
      <div className="grid gap-6 overflow-hidden bg-white border-b border-slate-100 pb-6">
        <div className="p-6 pb-0">
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
            <span>✨</span>
            <span>HIGHLIGHTS</span>
          </div>
          <h2 className="mt-3 text-lg font-bold leading-tight text-slate-900">
            What's included in the session
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Delivering relaxation, safety, and results in every service.
          </p>
          <div className="mt-4 space-y-3">
            {highlights.map((text: string) => (
              <div key={text} className="flex gap-3 text-slate-700">
                <span className="mt-0.5 text-sm text-amber-500 font-extrabold">✓</span>
                <p className="text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
