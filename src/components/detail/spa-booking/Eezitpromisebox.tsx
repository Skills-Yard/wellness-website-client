export default function VelloraPPromiseBox() {
  return (
    <div className="hidden lg:flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:w-75 xl:w-[320px] self-start">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">
            Vellora Promise
          </h3>
          <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center text-[10px] font-extrabold text-amber-600">
            100%
          </div>
        </div>
        <ul className="space-y-3 text-xs font-medium text-slate-600">
          <li className="flex items-center gap-2">
            <span className="text-amber-500 font-extrabold">✓</span>
            4.8+ Rated Certified Therapists
          </li>
          <li className="flex items-center gap-2">
            <span className="text-amber-500 font-extrabold">✓</span>
            Complete Relaxation Assured
          </li>
          <li className="flex items-center gap-2">
            <span className="text-amber-500 font-extrabold">✓</span>
            Natural & Skin-Safe Organic Products
          </li>
          <li className="flex items-center gap-2">
            <span className="text-amber-500 font-extrabold">✓</span>
            Single-Use Disposables for Hygiene
          </li>
        </ul>
      </div>
    </div>
  );
}