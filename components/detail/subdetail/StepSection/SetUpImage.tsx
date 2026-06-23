import Image from "next/image";

export default function SetUpImage() {
    return(
<section className="mx-auto max-w-6xl py-12 sm:px-2 lg:px-0 lg:py-5">
    <div className="bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
      <Image
        src="/images/detail/section6.png"
        alt="Service Banner"
        width={800}
        height={500}
        className="w-full object-cover"
      />
    </div>
  </section>
    );
}
