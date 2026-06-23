import Image from "next/image";

export default function Highlights() {
  const highlights = [
    "Highly recommended by customers for relaxation, general stress & stiffness relief",
    "Medium pressure using gentle kneading & long rhythmic strokes",
    "Lavender & Ylang Ylang Oil to ease muscle tension",
  ];

  return (
    <section className="mx-auto max-w-6xl px-0 pt-1 pb-1 sm:px-0 lg:px-0">
      <div className="grid gap-6 overflow-hidden bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:grid-cols-1 5fsm:items-center">
        <div className="p-5 pb-0">
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
            <span>✨</span>
            <span>HIGHLIGHTS</span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">
            Highly recommended by customers
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Relaxation, general stress & stiffness relief.
          </p>
          <div className="mt-2 space-y-4">
            {highlights.map((text) => (
              <div key={text} className="flex gap-3 text-slate-700">
                <span className="mt-1 text-lg text-emerald-600">✓</span>
                <p className="text-sm leading-6 sm:text-base">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 pt-0">
          <div className="bg-gray-200 text-gray-600 flex justify-between rounded-[10px] text-[15px] p-3">
            <h2>Why book stress relief massage</h2>
            <span>{">"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
