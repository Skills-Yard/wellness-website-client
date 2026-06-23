"use client";

import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="w-full flex-1 flex flex-col items-center justify-center py-20 px-4 text-center font-sans bg-gradient-to-b from-stone-50/40 via-white to-stone-50/20 select-none">
      <div className="w-full max-w-md space-y-6">
        {/* 3D clay render icon illustration */}
        <div className="relative w-44 h-44 mx-auto animate-pulse duration-[3000ms]">
          <Image
            src="/images/3d_physio.png"
            alt="Page not found"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-widest leading-none">
            ⚠️ Error 404
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Page not found
          </h1>
          <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" passHref className="w-full sm:w-auto">
            <Button className="w-full bg-[#111111] hover:bg-black text-white font-bold h-11 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/5 active:scale-95 transition-all border-none">
              <Home className="w-4 h-4" /> Go back home
            </Button>
          </Link>
          <Button
            onClick={() => alert("Support representative will be active shortly!")}
            variant="outline"
            className="w-full sm:w-auto border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 h-11 px-6 rounded-xl font-bold cursor-pointer active:scale-95 transition-all"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
}
