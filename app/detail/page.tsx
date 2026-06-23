import { Suspense } from "react";
import ButtonPop from "@/components/detail/detail";

export default function Detail() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading service details...</p>
                </div>
            </div>
        }>
            <ButtonPop />
        </Suspense>
    );
}