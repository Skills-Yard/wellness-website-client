import Image from "next/image";

export default function VelloraPromiseCard() {
    return (
        < div className="flex absolute h-[250px] bottom-0 flex-row items-start justify-between gap-4 mt-12  p-5 bg-gradient-to-br from-[#FFFDFC] via-[#FFF5F0] to-[#FFEAE5]  text-left shadow-xs overflow-hidden relative" >
            <div className="w-full h-full flex relative">
                <div className="flex-1 space-y-3 z-10">
                    <div>
                        <span className="inline-block bg-white border border-[#EAD2C6] text-[#8C5D47] text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-md uppercase select-none">
                            Vellora Promise
                        </span>
                    </div>
                    <h4 className="text-lg sm:text-2xl font-serif text-[#4E3425] leading-tight font-bold">
                        Care you can count on,<br />Every Single Time.
                    </h4>
                    <p className="text-xs sm:text-sm text-[#7D6456]/90 font-medium leading-relaxed">
                        Rigorous checks. Quality care. Complete peace of mind.
                    </p>
                </div>
                <div className="shrink-0 z-10 absolute -right-5 -top-2  flex items-center justify-center">
                    <Image
                        src="/images/vellora_promise_stamps.png"
                        alt="Vellora Promise Seal"
                        width={128}
                        height={128}
                        className="object-contain w-28 h-28 sm:w-32 sm:h-32 select-none"
                    />
                </div>
            </div>
        </div >
    )
}