import Image from "next/image";

export default function EezitPromiseCard() {
    return (
        <div className="relative mt-12 w-full overflow-hidden">
            <Image
                src="/images/footer/image.png"
                alt="Eezit Promise — Care you can count on, every single time. Rigorous checks. Quality care. Complete peace of mind."
                width={390}
                height={329}
                sizes="100vw"
                className="h-auto w-full object-cover"
            />
        </div>
    )
}
