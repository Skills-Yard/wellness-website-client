import Image from "next/image";

export default function EezitPromiseCard() {
  return (
    <div className="relative flex h-62.5 flex-row items-start justify-between gap-4 mt-12 p-5 bg-gradient-to-br from-[#FFFDFC] via-[#FFF5F0] to-[#FFEAE5] text-left shadow-xs overflow-hidden">
      <div className="w-full h-full flex relative">
        <div className="flex-1 flex flex-col gap-4 z-10">
          <div>
            <span className="inline-block bg-white border border-black/9 text-[#713414] text-[10px] font-semibold tracking-wide px-2 py-1 rounded uppercase select-none">
              Eezit Promise
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xl font-serif font-normal leading-none text-[#713414]">
              Care you can count on,
            </p>
            <p className="text-xl font-serif font-normal leading-none text-[#A67257]">
              Every Single Time.
            </p>
          </div>
          <p className="max-w-44.25 text-xs font-medium leading-3.75 text-black/74">
            Rigorous checks. Quality care. Complete peace of mind.
          </p>
        </div>
        <div className="shrink-0 z-10 absolute -right-5 -top-2 flex items-center justify-center">
          <Image
            src="/images/eezit_promise_stamps1.png"
            alt="Eezit Promise Seal"
            width={121}
            height={126}
            className="object-contain w-30.25 h-31.5 select-none"
          />
        </div>
      </div>
    </div>
  );
}
