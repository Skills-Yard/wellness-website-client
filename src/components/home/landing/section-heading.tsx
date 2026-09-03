// Shared eyebrow + display-title block for the desktop landing sections.
// Figma "Frame 384": a brand-strong caps eyebrow above an Aboreto-style
// serif heading in brown. `font-serif` maps to Abyssinica_SIL app-wide
// (see globals.css / layout.tsx) — the repo's stand-in for the Figma's
// Aboreto display face.

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  align = "center",
  className = "",
  titleClassName = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col gap-3 ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-brand-strong">
        {eyebrow}
      </span>
      <h2
        className={`font-serif text-[30px] leading-[1.05] text-brown sm:text-[36px] ${titleClassName}`}
      >
        {title}
      </h2>
    </div>
  );
}
