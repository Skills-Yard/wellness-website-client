'use client'

import { Sparkles } from "lucide-react";

// Figma "Frame 78" footer. Columns mirror the design; links are still
// placeholders (href="#") — the Services column can point at
// /detail/{slug} once those routes are the target.
// TODO: wire real destinations for footer links.
const FOOTER_SECTIONS = [
  {
    title: "Services",
    links: ["Spa & Beauty", "Massage Therapy", "Physiotherapy", "Salon at Home"],
  },
  {
    title: "Company",
    links: ["About us", "Careers", "Quality Standards", "Therapist safety code"],
  },
  {
    title: "Support",
    links: [
      "Help Center",
      "Contact us",
      "Safety Protocol",
      "Terms & conditions",
      "Privacy policy",
    ],
  },
];

const SOCIAL_LINKS = [
  { name: "Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { name: "Facebook", path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" },
  { name: "Instagram", path: "M13 0c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zm0 2c6.08 0 11 4.92 11 11s-4.92 11-11 11-11-4.92-11-11 4.92-11 11-11z M13 6c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z M17.5 5.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" },
  { name: "LinkedIn", path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" },
];

export default function Footer() {
  return (
    <footer className="hidden bg-espresso text-white/70 md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-8 lg:mb-12">

          {/* Brand + social */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-[0_2px_12px_rgba(251,191,36,0.35)]">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-[17px] uppercase tracking-[0.22em] text-white">
                Eezit
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-white/60">
              Wellness, spa &amp; physiotherapy available at your doorstep.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-amber-400 hover:border-amber-400/40 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-sm text-white mb-4 lg:mb-5">{section.title}</h3>
              <ul className="space-y-2.5 lg:space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/70 hover:text-amber-400 transition-colors duration-200 font-medium"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Get In Touch — visual-only newsletter capture */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold text-white mb-4">Get In Touch</h3>
            <p className="text-[13px] text-white/60 mb-3">
              Get the latest wellness tips &amp; updates.
            </p>
            {/* TODO: wire newsletter endpoint */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your Email"
                aria-label="Email address"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-espresso transition-colors hover:bg-amber-300"
              >
                Subscribe
              </button>
            </form>

            {/* App badges */}
            <div className="mt-6 space-y-2">
              <a href="#" className="block transition-opacity hover:opacity-90">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  className="h-9 w-auto"
                />
              </a>
              <a href="#" className="block transition-opacity hover:opacity-90">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-9 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 lg:pt-8">
          <div className="space-y-2">
            <p className="text-xs text-white/45 leading-relaxed">
              * Medical disclaimer: Home physiotherapy sessions are conducted by licensed, registered physical therapists. Consult a doctor for acute medical emergencies.
            </p>
            <p className="text-xs text-white/55 font-medium">
              © Copyright 2026 Eezit Wellness Limited. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
