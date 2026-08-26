import FaqPage from "@/src/components/faq/FaqPage";
import { Suspense } from "react";

export default function Faq() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading FAQs...</p>
          </div>
        </div>
      }
    >
      <FaqPage />
    </Suspense>
  );
}
