'use client'
import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const [openSection, setOpenSection] = useState<'company' | 'customers' | 'professionals' | null>(null);

  const toggleSection = (section: 'company' | 'customers' | 'professionals') => {
    setOpenSection(prevSection => prevSection === section ? null : section);
  };

  return (
    <footer className="bg-[#f8f9fa] text-gray-800 p-4 sm:p-6 md:p-8 lg:p-12 font-sans border-t border-gray-200/50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 mb-8 md:mb-10 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-[0_2px_12px_rgba(251,191,36,0.4)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[17px] font-bold tracking-tight text-gray-900">
              Vell<span className="text-amber-500">ora</span>
            </span>
            <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">Wellness & Therapy</span>
          </div>
        </div>

        {/* Footer Navigation Links / Accordions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-8 mb-8 md:mb-12 border-b border-gray-250/20 md:border-none">

          {/* Company Links */}
          <div className="border-b border-gray-100 md:border-none py-4 md:py-0">
            <button
              type="button"
              onClick={() => toggleSection('company')}
              className="flex justify-between items-center w-full md:cursor-default text-left font-bold text-gray-900 text-sm md:mb-4 focus:outline-none cursor-pointer"
            >
              <span>Company</span>
              <span className={`text-sm transition-transform duration-200 md:hidden ${openSection === 'company' ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>
            <ul className={`mt-3 md:mt-0 space-y-3 md:space-y-2.5 text-xs sm:text-sm text-gray-500 transition-all duration-300 md:block ${openSection === 'company' ? 'block' : 'hidden'}`}>
              <li><a href="#" className="hover:text-amber-600 block py-1 md:py-0 transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-amber-600 block py-1 md:py-0 transition-colors">Quality Standards</a></li>
              <li><a href="#" className="hover:text-amber-600 block py-1 md:py-0 transition-colors">Terms & conditions</a></li>
              <li><a href="#" className="hover:text-amber-600 block py-1 md:py-0 transition-colors">Privacy policy</a></li>
              <li><a href="#" className="hover:text-amber-600 block py-1 md:py-0 transition-colors">Therapist safety code</a></li>
              <li><a href="#" className="hover:text-amber-600 block py-1 md:py-0 transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* For Customers Links */}
          <div className="border-b border-gray-100 md:border-none py-4 md:py-0">
            <button
              type="button"
              onClick={() => toggleSection('customers')}
              className="flex justify-between items-center w-full md:cursor-default text-left font-bold text-gray-900 text-sm md:mb-4 focus:outline-none cursor-pointer"
            >
              <span>For Customers</span>
              <span className={`text-sm transition-transform duration-200 md:hidden ${openSection === 'customers' ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>
            <ul className={`mt-3 md:mt-0 space-y-3 md:space-y-2.5 text-xs sm:text-sm text-gray-500 transition-all duration-300 md:block ${openSection === 'customers' ? 'block' : 'hidden'}`}>
              <li><a href="#" className="hover:text-amber-600 block py-1 md:py-0 transition-colors">Vellora Reviews</a></li>
              <li><a href="#" className="hover:text-amber-600 block py-1 md:py-0 transition-colors">Safety Protocol</a></li>
              <li><a href="#" className="hover:text-amber-600 block py-1 md:py-0 transition-colors">Contact us / Help Center</a></li>
            </ul>
          </div>

          {/* For Professionals Links */}
          <div className="border-b border-gray-100 md:border-none py-4 md:py-0">
            <button
              type="button"
              onClick={() => toggleSection('professionals')}
              className="flex justify-between items-center w-full md:cursor-default text-left font-bold text-gray-900 text-sm md:mb-4 focus:outline-none cursor-pointer"
            >
              <span>For Professionals</span>
              <span className={`text-sm transition-transform duration-200 md:hidden ${openSection === 'professionals' ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>
            <ul className={`mt-3 md:mt-0 space-y-3 md:space-y-2.5 text-xs sm:text-sm text-gray-500 transition-all duration-300 md:block ${openSection === 'professionals' ? 'block' : 'hidden'}`}>
              <li><a href="#" className="hover:text-amber-600 block py-1 md:py-0 transition-colors">Join as a Wellness Partner</a></li>
              <li><a href="#" className="hover:text-amber-600 block py-1 md:py-0 transition-colors">Therapist registration</a></li>
            </ul>
          </div>

          {/* Social Links & App Stores */}
          <div className="py-6 md:py-0 flex flex-col sm:flex-row md:flex-col justify-between sm:items-center md:items-start gap-6 md:gap-0">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Connect With Us</h3>
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {/* X / Twitter */}
                <a href="#" aria-label="Twitter" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-255/10 text-gray-700 hover:text-amber-600 hover:bg-stone-50 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a href="#" aria-label="Facebook" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-255/10 text-gray-700 hover:text-amber-600 hover:bg-stone-50 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a href="#" aria-label="Instagram" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-255/10 text-gray-700 hover:text-amber-600 hover:bg-stone-50 transition-colors">
                  <svg className="w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a href="#" aria-label="LinkedIn" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-255/10 text-gray-700 hover:text-amber-600 hover:bg-stone-50 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* App Badges */}
            <div className="flex flex-row sm:flex-col gap-2.5 min-w-[240px] sm:min-w-0 max-w-[280px] sm:max-w-[130px] md:max-w-[140px] md:mt-6 w-full select-none">
              <a href="#" className="block flex-1 transition-opacity hover:opacity-90">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  className="w-full h-auto"
                />
              </a>
              <a href="#" className="block flex-1 transition-opacity hover:opacity-90">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="w-full h-auto"
                />
              </a>
            </div>
          </div>

        </div>

        {/* Desktop Divider Line */}
        <hr className="hidden md:block border-gray-200 my-6" />

        {/* Legal Disclaimer / Copyright */}
        <div className="text-[11px] leading-relaxed text-gray-400 space-y-2 pt-4 md:pt-0">
          <p>* Medical disclaimer: Home physiotherapy sessions are conducted by licensed, registered physical therapists. Consult a doctor for acute medical emergencies.</p>
          <p className="text-justify md:text-left">
            © Copyright 2026 Vellora Wellness Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}