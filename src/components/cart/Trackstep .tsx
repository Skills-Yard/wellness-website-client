"use client";

interface TrackStepProps {
  label: string;
  active: boolean;
  done: boolean;
}

/** Tracking stepper dot */
export default function TrackStep({ label, active, done }: TrackStepProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          done
            ? "border-amber-500 bg-amber-500"
            : active
            ? "border-amber-500 bg-white"
            : "border-gray-200 bg-white"
        }`}
      >
        {done && (
          <svg
            viewBox="0 0 10 10"
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              d="M1.5 5 L4 7.5 L8.5 2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {active && !done && (
          <div className="w-2 h-2 rounded-full bg-amber-500" />
        )}
      </div>
      <span
        className={`text-[9px] font-semibold text-center leading-tight max-w-[48px] ${
          done || active ? "text-gray-800" : "text-gray-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}