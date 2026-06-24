'use client'

import { Sparkles, Mail, MapPin } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Company",
    links: [
      "About us",
      "Quality Standards",
      "Terms & conditions",
      "Privacy policy",
      "Therapist safety code",
      "Careers"
    ]
  },
  {
    title: "For Customers",
    links: [
      "Vellora Reviews",
      "Safety Protocol",
      "Contact us / Help Center"
    ]
  },
  {
    title: "For Professionals",
    links: [
      "Join as a Wellness Partner",
      "Therapist registration"
    ]
  }
];

const SOCIAL_LINKS = [
  { name: "Twitter", icon: "𝕏", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { name: "Facebook", path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" },
  { name: "Instagram", path: "M13 0c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zm0 2c6.08 0 11 4.92 11 11s-4.92 11-11 11-11-4.92-11-11 4.92-11 11-11z M13 6c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z M17.5 5.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" },
  { name: "LinkedIn", path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" }
];

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] text-gray-800 border-t border-gray-200/50 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-8 lg:mb-12">
          
          {/* Brand - Column 1 */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-[0_2px_12px_rgba(251,191,36,0.4)]">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[17px] font-bold tracking-tight">Vell<span className="text-amber-500">ora</span></span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Wellness & Therapy</span>
              </div>
            </div>
          </div>

          {/* Links Sections - Columns 2-4 */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-sm text-gray-900 mb-4 lg:mb-5">{section.title}</h3>
              <ul className="space-y-2.5 lg:space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-sm text-gray-600 hover:text-amber-600 transition-colors duration-200 font-medium"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social & Apps - Column 5 */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="space-y-6">
              {/* Social Links */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Connect With Us</h3>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.name}
                      href="#"
                      aria-label={social.name}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d={social.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* App Badges */}
              <div className="space-y-2">
                <a 
                  href="#" 
                  className="block transition-opacity hover:opacity-90"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                    alt="Download on the App Store" 
                    className="h-10 w-auto"
                  />
                </a>
                <a 
                  href="#" 
                  className="block transition-opacity hover:opacity-90"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                    alt="Get it on Google Play" 
                    className="h-10 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6 lg:pt-8">
          <div className="space-y-2">
            <p className="text-xs text-gray-500 leading-relaxed">
              * Medical disclaimer: Home physiotherapy sessions are conducted by licensed, registered physical therapists. Consult a doctor for acute medical emergencies.
            </p>
            <p className="text-xs text-gray-500 font-medium">
              © Copyright 2026 Vellora Wellness Limited. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}