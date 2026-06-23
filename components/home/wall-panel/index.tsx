import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function WallPanel() {
    return (
        <section className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
            <div className="relative overflow-hidden rounded-tr-xl rounded-bl-xl bg-[#FEF9C3] flex flex-col md:flex-row items-center justify-between p-4 sm:p-8 md:p-10 gap-0 min-h-[350px]">

                {/* Left Text content */}
                <div className="relative z-10 flex-1 flex flex-col items-start justify-center space-y-5 max-sm:space-y-4 py-4 md:py-6 pl-2 sm:pl-4">
                    <h2 className="text-xl sm:text-4xl lg:text-[40px] font-extrabold text-neutral-900 leading-tight tracking-tight max-w-lg">
                        Give your body the wellness renewal it deserves
                    </h2>

                    <p className="text-base sm:text-lg text-neutral-800 font-medium tracking-wide">
                        Massage & Spa Packages
                    </p>

                    <Button className="bg-[#111111] max-sm:hidden text-white hover:bg-black font-bold text-sm h-12 px-8 rounded-xl cursor-pointer transition-all active:scale-95 border-none shadow-sm">
                        Book now
                    </Button>
                </div>

                {/* Right Image Container */}
                <div className="relative w-full md:w-[48%] aspect-[4/3] sm:aspect-[16/10] md:aspect-[1.4] rounded-tr-xl rounded-bl-xl overflow-hidden bg-neutral-100 shrink-0">
                    <Image
                        src="/images/banner_massage.png"
                        alt="Wellness renewal package"
                        fill
                        sizes="(max-w-7xl) 50vw, 40vw"
                        className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                        priority
                    />
                    <Button className="bg-[#ffffff] hidden absolute max-sm:flex text-black hover:bg-black hover:text-white font-bold text-sm 
                    h-9 px-7 bottom-4 left-4 rounded-sm cursor-pointer transition-all active:scale-95 border-none shadow-sm">
                        Book now
                    </Button>
                </div>

            </div>
        </section>
    );
}