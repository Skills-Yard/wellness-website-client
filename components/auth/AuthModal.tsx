/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
// Assuming you have lucide-react installed for standard icons. If not, you can replace these with SVGs.
import {
  ChevronDown,
  ArrowLeft,
  Search,
  PhoneCall,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- DUMMY DATA (Normally imported from your authData.ts) ---
const professions = [
  "TV Repair",
  "AC Service",
  "Plumber",
  "Electrician",
  "Cleaning",
];
const cities = [
  "Delhi NCR",
  "Banda",
  "Garhwa",
  "Surianwan",
  "Guwahati",
  "Etah",
  "Burhanpur",
  "Warangal",
  "Nagercoil",
  "Bhubaneswar",
];

type AuthStep = "PHONE" | "OTP" | "ONBOARDING";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const [step, setStep] = useState<AuthStep>("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(26);

  // Onboarding Form State
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Sub-view states
  const [showCitySelect, setShowCitySelect] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const [showWorkSelect, setShowWorkSelect] = useState(false);
  const [workSearch, setWorkSearch] = useState("");

  const [notification, setNotification] = useState({
    visible: false,
    message: "",
  });

  // ==========================================
  // 1. PHONE STEP logic
  // ==========================================
  const handlePhoneSubmit = () => {
    if (phone.length >= 10) setStep("OTP");
  };

  const handleSkip = () => {
    onClose(); // Skip functionality
  };
  // ==========================================
  // 2. OTP SIMULATION logic
  // ==========================================
  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (step === "OTP") {
      // Timer countdown
      countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // Auto-fill simulation
      const otpTimer = setTimeout(() => {
        const generatedOtp = Math.floor(
          100000 + Math.random() * 900000,
        ).toString();
        setNotification({
          visible: true,
          message: `Your verification code is ${generatedOtp}`,
        });

        setTimeout(() => {
          setOtp(generatedOtp.split(""));
          setNotification({ visible: false, message: "" });
          setTimeout(() => setStep("ONBOARDING"), 600);
        }, 2000);
      }, 1500);

      return () => {
        clearTimeout(otpTimer);
        clearInterval(countdown);
      };
    }
  }, [step]);

  // ==========================================
  // 3. ONBOARDING logic
  // ==========================================
  const handleComplete = () => {
    alert(`Setup complete for ${name} as ${profession} in ${city}!`);
    onClose();
    router.push("/");
  };

  const isFormValid = name.trim().length > 0 && profession && city && agreed;

  // Filter lists based on search
  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase()),
  );
  const filteredProfessions = professions.filter((p) =>
    p.toLowerCase().includes(workSearch.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4 animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-md flex flex-col bg-white h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:rounded-3xl overflow-hidden shadow-2xl slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==========================================
            VIEW: CITY SELECTION (Overlay)
        ========================================== */}
        {showCitySelect && step === "ONBOARDING" ? (
          <div className="absolute inset-0 z-20 flex flex-col bg-white h-full slide-in-from-right-full duration-300">
            <div className="flex items-center px-6 py-4">
              <button onClick={() => setShowCitySelect(false)} className="mr-4">
                <ArrowLeft className="h-6 w-6 text-black" />
              </button>
            </div>

            <div className="px-6 pb-4">
              <h2 className="text-2xl font-bold text-black mb-6">
                Where do you live?
              </h2>

              <div className="flex items-center rounded-full border border-slate-300 px-4 py-3 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
                <Search className="h-5 w-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search your city"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full text-base outline-none text-slate-900"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {filteredCities.map((c, idx) => (
                <label
                  key={idx}
                  className="flex items-center justify-between py-4 border-b border-dashed border-slate-200 cursor-pointer"
                >
                  <span className="text-lg text-slate-800">{c}</span>
                  <div
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${city === c ? "border-blue-600" : "border-slate-300"}`}
                  >
                    {city === c && (
                      <div className="h-3 w-3 rounded-full bg-blue-600" />
                    )}
                  </div>
                  {/* Hidden radio for accessibility */}
                  <input
                    type="radio"
                    name="city"
                    value={c}
                    checked={city === c}
                    onChange={() => {
                      setCity(c);
                      setShowCitySelect(false);
                    }}
                    className="hidden"
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {/* ==========================================
            VIEW: WORK SELECTION (Overlay)
        ========================================== */}
        {showWorkSelect && step === "ONBOARDING" ? (
          <div className="absolute inset-0 z-20 flex flex-col bg-white h-full slide-in-from-right-full duration-300">
            <div className="flex items-center px-6 py-4">
              <button onClick={() => setShowWorkSelect(false)} className="mr-4">
                <ArrowLeft className="h-6 w-6 text-black" />
              </button>
            </div>

            <div className="px-6 pb-4">
              <h2 className="text-2xl font-bold text-black mb-6">
                What work do you do?
              </h2>

              <div className="flex items-center rounded-full border border-slate-300 px-4 py-3 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
                <Search className="h-5 w-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search profession"
                  value={workSearch}
                  onChange={(e) => setWorkSearch(e.target.value)}
                  className="w-full text-base outline-none text-slate-900"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {filteredProfessions.map((p, idx) => (
                <label
                  key={idx}
                  className="flex items-center justify-between py-4 border-b border-dashed border-slate-200 cursor-pointer"
                >
                  <span className="text-lg text-slate-800">{p}</span>
                  <div
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${profession === p ? "border-blue-600" : "border-slate-300"}`}
                  >
                    {profession === p && (
                      <div className="h-3 w-3 rounded-full bg-blue-600" />
                    )}
                  </div>
                  {/* Hidden radio for accessibility */}
                  <input
                    type="radio"
                    name="profession"
                    value={p}
                    checked={profession === p}
                    onChange={() => {
                      setProfession(p);
                      setShowWorkSelect(false);
                    }}
                    className="hidden"
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {/* ==========================================
            MAIN CONTENT AREA
        ========================================== */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* --- STEP 1: PHONE --- */}
          {step === "PHONE" && (
            <div className="flex flex-col h-full px-6 py-6">
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleSkip}
                  className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 active:scale-95 transition-transform"
                >
                  Skip
                </button>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="mb-6 h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <PhoneCall className="h-6 w-6" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Enter your phone number
                </h2>
                <p className="mt-2 text-base text-slate-500">
                  We'll send you a text with a verification code.
                  <br /> Standard tariff may apply.
                </p>

                <div className="mt-8 flex rounded-xl border border-slate-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black overflow-hidden transition-all">
                  <div className="flex items-center gap-1 border-r border-slate-300 px-4 bg-transparent">
                    <span className="text-base text-slate-800 font-medium">
                      +91
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    autoFocus
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full px-4 py-4 text-base text-slate-900 outline-none font-medium"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="mt-auto pt-6 pb-2 text-center">
                <p className="text-sm text-slate-600 mb-4">
                  By continuing, you agree to our{" "}
                  <span className="underline font-medium cursor-pointer">
                    T&C
                  </span>{" "}
                  and{" "}
                  <span className="underline font-medium cursor-pointer">
                    Privacy policy
                  </span>
                </p>
                <button
                  onClick={handlePhoneSubmit}
                  disabled={phone.length < 10}
                  className={`w-full rounded-xl py-4 font-bold transition-all active:scale-[0.98] ${
                    phone.length >= 10
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* --- STEP 2: OTP --- */}
          {step === "OTP" && (
            <div className="flex flex-col h-full px-6 py-6">
              <button onClick={() => setStep("PHONE")} className="mb-8 w-fit">
                <ArrowLeft className="h-6 w-6 text-black" />
              </button>

              <div className="flex-1 flex flex-col">
                <div className="mb-6 h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <MessageSquare className="h-6 w-6" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Enter verification code
                </h2>
                <p className="mt-2 text-base text-slate-500">
                  A 6-digit verification code has been sent on
                  <br /> +91 {phone}
                </p>

                <div className="mt-8 flex justify-between gap-2 max-w-[320px]">
                  {otp.map((digit, index) => (
                    <div
                      key={index}
                      className={`flex h-12 w-11 sm:h-14 sm:w-12 items-center justify-center rounded-xl border text-xl font-medium transition-all ${
                        digit !== ""
                          ? "border-slate-800 text-slate-900"
                          : index === 0
                            ? "border-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,1)]"
                            : "border-slate-300"
                      }`}
                    >
                      {digit ||
                        (index === 0 ? (
                          <span className="animate-pulse">|</span>
                        ) : (
                          ""
                        ))}
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-dashed border-slate-300 pt-6">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <span>⏱</span>
                    <span>0:{timer < 10 ? `0${timer}` : timer}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- STEP 3: ONBOARDING --- */}
          {step === "ONBOARDING" && (
            <div className="flex flex-col h-full bg-slate-50/50">
              {/* Optional Header equivalent */}
              <div className="flex justify-end p-4 pb-0">
                <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">
                  <span className="text-lg">Aअ</span> English
                </button>
              </div>

              <div className="px-6 pt-6 pb-8 flex-1 flex flex-col">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
                  Tell us about yourself!
                </h2>

                <div className="space-y-6 flex-1">
                  {/* Name Input */}
                  <div>
                    <label className="text-base font-medium text-slate-800 ml-1">
                      What's your name?
                    </label>
                    <div
                      className={`mt-2 rounded-full border px-5 py-3.5 bg-white transition-all ${name ? "border-blue-600" : "border-slate-300"}`}
                    >
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Himanshu"
                        className="w-full outline-none text-base text-slate-900"
                      />
                    </div>
                    <p className="mt-3 ml-1 text-xs text-amber-700">
                      Special Characters like !@#$%^&*()_+={`{}`};~,. are not
                      allowed
                    </p>
                  </div>

                  {/* Profession Select Trigger */}
                  <div>
                    <label className="text-base font-medium text-slate-800 ml-1">
                      What work do you do?
                    </label>
                    <div
                      onClick={() => setShowWorkSelect(true)}
                      className="mt-2 flex items-center justify-between rounded-full border border-slate-300 bg-white px-5 py-3.5 cursor-pointer hover:border-blue-600 transition-all"
                    >
                      <span
                        className={`text-base ${profession ? "text-slate-900" : "text-slate-400"}`}
                      >
                        {profession || "Select profession"}
                      </span>
                      <ChevronDown className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>

                  {/* City Select Trigger */}
                  <div>
                    <label className="text-base font-medium text-slate-800 ml-1">
                      Where do you live?
                    </label>
                    <div
                      onClick={() => setShowCitySelect(true)}
                      className="mt-2 flex items-center justify-between rounded-full border border-slate-300 bg-white px-5 py-3.5 cursor-pointer hover:border-blue-600 transition-all"
                    >
                      <span
                        className={`text-base ${city ? "text-slate-900" : "text-slate-400"}`}
                      >
                        {city || "Select your city"}
                      </span>
                      <ChevronDown className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 flex flex-col gap-4">
                  <label className="flex items-start gap-3 rounded-xl bg-slate-100 p-4 cursor-pointer">
                    <div className="relative flex items-center mt-1">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                    </div>
                    <p className="text-sm text-slate-700 leading-tight">
                      By proceeding, you agree to Urban Company's <br />
                      <span className="font-bold underline cursor-pointer">
                        Terms & conditions
                      </span>{" "}
                      and{" "}
                      <span className="font-bold underline cursor-pointer">
                        Privacy policy
                      </span>
                    </p>
                  </label>

                  <button
                    onClick={handleComplete}
                    disabled={!isFormValid}
                    className={`w-full rounded-full py-4 font-bold text-lg transition-all active:scale-[0.98] ${
                      isFormValid
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Notification Message */}
      <div
        className={`fixed left-1/2 z-[60] w-[90%] max-w-sm -translate-x-1/2 rounded-2xl bg-slate-800 p-4 text-white shadow-2xl transition-all duration-500 ${
          notification.visible
            ? "bottom-6 sm:bottom-10 opacity-100"
            : "-bottom-24 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-300">Messages • Now</p>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
