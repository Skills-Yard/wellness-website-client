"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown, MessageSquare, PhoneCall } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import type { CreateUserBody } from "@/src/types/auth";
import { authApi } from "@/src/services/authApi";
import { userApi } from "@/src/services/userApi";
import { requestPushNotifications } from "@/src/lib/notifications/push";

type AuthStep = "PHONE" | "OTP" | "ONBOARDING";

type StoredProfile = {
  phone: string;
  name: string;
  email: string;
};

export default function AuthModal({
  onClose,
  onComplete,
  redirectToProfile = true,
}: {
  onClose: () => void;
  onComplete?: () => void;
  /** Whether to navigate to /profile once login completes. Defaults to true
   *  (the original behavior, still right for an intentional "Log in" click
   *  from the navbar/profile page). Callers that pop this modal up as a
   *  gate in front of content the visitor was already trying to reach
   *  (a booking, the cart, devices, notifications) should pass `false` so
   *  login lands them back where they were instead of on /profile. */
  redirectToProfile?: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(26);
  const [signupToken, setSignupToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhotoKey, setProfilePhotoKey] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<CreateUserBody["gender"] | "">("");
  const [referredBy, setReferredBy] = useState("");
  const [notification, setNotification] = useState({ visible: false, message: "" });
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showMessage = (message: string) => {
    setNotification({ visible: true, message });
    window.setTimeout(() => setNotification({ visible: false, message: "" }), 3500);
  };

  useEffect(() => {
    if (step !== "OTP") return;
    const countdown = window.setInterval(() => setTimer((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(countdown);
  }, [step]);

  const handlePhoneSubmit = async () => {
    if (phone.length !== 10 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await authApi.requestOtp({ countryCode: "+91", phone });
      setOtp(Array(6).fill(""));
      setTimer(26);
      setStep("OTP");
      showMessage("Verification code sent.");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Could not send verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeAuthentication = (accessToken: string, refreshToken?: string, profile?: StoredProfile) => {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (profile) localStorage.setItem("userProfile", JSON.stringify(profile));
    localStorage.setItem("isUserLoggedIn", "true");
    // Best-effort: prompts for notification permission now that we have an
    // identity to attach the device token to. No-ops silently if Firebase
    // isn't configured, the browser doesn't support it, or the user denies —
    // never blocks navigation on the outcome.
    void requestPushNotifications(accessToken);
    onComplete?.();
    onClose();
    if (redirectToProfile) router.push("/profile");
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await authApi.verifyOtp({
        phone,
        countryCode: "+91",
        code,
        clientId: "uc_web_customer_portal",
        // Left blank on purpose — requesting notification permission before the
        // visitor is authenticated is bad UX. completeAuthentication() below
        // requests it (and registers the resulting token) right after login instead.
        fcmToken: "",
        deviceType: "WEB",
        deviceName: navigator.userAgent,
      });
      const { accessToken, refreshToken, signupToken } = response.data;

      if (accessToken) {
        completeAuthentication(accessToken, refreshToken);
        return;
      }
      if (signupToken) {
        setSignupToken(signupToken);
        setStep("ONBOARDING");
        return;
      }
      showMessage("The verification response did not include an access or signup token.");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Could not verify the code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Boolean(name.trim() && email.trim() && dateOfBirth && gender);

  const handleComplete = async () => {
    if (!isFormValid || !signupToken || isSubmitting) return;
    // isFormValid already requires a non-empty gender; this re-check exists purely to
    // narrow the type from `CreateUserBody["gender"] | ""` for the request body below.
    if (!gender) return;
    setIsSubmitting(true);
    try {
      const response = await userApi.create(
        {
          countryCode: "+91",
          name: name.trim(),
          email: email.trim(),
          profilePhotoKey: profilePhotoKey.trim(),
          dateOfBirth,
          gender,
          ...(referredBy.trim() ? { referredBy: referredBy.trim() } : {}),
        },
        signupToken,
      );
      completeAuthentication(response.data.tokens.accessToken, response.data.tokens.refreshToken, {
        phone: `+91 ${phone}`,
        name: name.trim(),
        email: email.trim(),
      });
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Could not create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((current) => current.map((item, itemIndex) => itemIndex === index ? digit : item));
    if (digit) otpRefs.current[index + 1]?.focus();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm gap-0 overflow-hidden rounded-[24px] border border-stone-100 bg-white p-0 shadow-2xl" showCloseButton={false}>
        {step === "PHONE" && (
          <div className="flex flex-col px-5 py-5">
            <div className="mb-4 h-10 w-10 rounded-full bg-amber-50 p-2.5 text-amber-500"><PhoneCall className="h-5 w-5" /></div>
            <h2 className="text-lg font-bold text-stone-900">Continue with your phone number</h2>
            <p className="mt-1 text-xs text-stone-500">We&apos;ll send a verification code to your phone.</p>
            <div className="mt-5 flex overflow-hidden rounded-xl border border-stone-200 bg-stone-50/20 focus-within:border-amber-500">
              <span className="flex items-center gap-1 border-r border-stone-200 px-3 text-sm font-medium text-stone-700">+91 <ChevronDown className="h-3.5 w-3.5 text-stone-400" /></span>
              <input type="tel" maxLength={10} autoFocus value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} className="w-full bg-transparent px-3 py-2.5 text-sm font-medium outline-none" placeholder="Phone number" />
            </div>
            <button onClick={handlePhoneSubmit} disabled={phone.length !== 10 || isSubmitting} className="mt-8 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400">
              {isSubmitting ? "Sending..." : "Continue"}
            </button>
          </div>
        )}

        {step === "OTP" && (
          <div className="flex flex-col px-5 py-5">
            <button onClick={() => setStep("PHONE")} className="mb-4 w-fit p-1"><ArrowLeft className="h-4 w-4 text-stone-700" /></button>
            <div className="mb-4 h-10 w-10 rounded-xl bg-amber-50 p-2.5 text-amber-500"><MessageSquare className="h-5 w-5" /></div>
            <h2 className="text-lg font-bold text-stone-900">Enter verification code</h2>
            <p className="mt-1 text-xs text-stone-500">A 6-digit code was sent to +91 {phone}.</p>
            <div className="mt-5 flex justify-between gap-1.5">
              {otp.map((digit, index) => <input key={index} ref={(element) => { otpRefs.current[index] = element; }} inputMode="numeric" maxLength={1} value={digit} onChange={(event) => updateOtp(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digit) otpRefs.current[index - 1]?.focus(); }} className="h-10 w-9 rounded-lg border border-stone-200 text-center text-sm font-semibold outline-none focus:border-amber-500" />)}
            </div>
            <button onClick={verifyOtp} disabled={otp.join("").length !== 6 || isSubmitting} className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400">{isSubmitting ? "Verifying..." : "Verify code"}</button>
            <p className="mt-5 text-xs text-stone-400">Resend available in 0:{timer.toString().padStart(2, "0")}</p>
          </div>
        )}

        {step === "ONBOARDING" && (
          <div className="px-5 py-5">
            <button onClick={() => setStep("OTP")} className="mb-4 w-fit p-1"><ArrowLeft className="h-4 w-4 text-stone-700" /></button>
            <h2 className="text-lg font-bold text-stone-900">Complete your profile</h2>
            <p className="mt-1 text-xs text-stone-500">Add your details to finish creating your account.</p>
            <div className="mt-5 space-y-3">
              <Field label="Full name"><input value={name} onChange={(event) => setName(event.target.value)} className="field" placeholder="John Doe" autoFocus /></Field>
              <Field label="Email address"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field" placeholder="john@example.com" /></Field>
              <Field label="Profile photo key"><input value={profilePhotoKey} onChange={(event) => setProfilePhotoKey(event.target.value)} className="field" placeholder="s3-key-123" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date of birth"><input type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} className="field" /></Field>
                <Field label="Gender"><select value={gender} onChange={(event) => setGender(event.target.value as CreateUserBody["gender"] | "")} className="field"><option value="">Select</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option></select></Field>
              </div>
              <Field label="Referral code (optional)"><input value={referredBy} onChange={(event) => setReferredBy(event.target.value)} className="field" placeholder="clh123xyz..." /></Field>
            </div>
            <button onClick={handleComplete} disabled={!isFormValid || isSubmitting} className="mt-6 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400">{isSubmitting ? "Creating account..." : "Create account"}</button>
          </div>
        )}
        <div className={`fixed bottom-6 left-1/2 z-60 w-[90%] max-w-xs -translate-x-1/2 rounded-2xl bg-stone-900 p-3 text-xs text-white shadow-2xl transition-all ${notification.visible ? "opacity-100" : "pointer-events-none translate-y-24 opacity-0"}`}>{notification.message}</div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">{label}{children}</label>;
}
