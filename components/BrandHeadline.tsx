import Image from "next/image";
import Link from "next/link";

export function BrandHeadline() {
    return (
        <section className="w-screen max-w-none relative left-1/2 -translate-x-1/2 z-0 flex justify-center -mb-6 md:-mb-10 overflow-hidden pointer-events-none select-none">
            <Link href="https://www.holbank.com/" target="_blank" rel="noopener noreferrer" className="pointer-events-auto">
                <Image
                    src="/holbank.svg"
                    alt="HOLBANK"
                    width={2400}
                    height={400}
                    className="w-screen h-auto mb-12"
                    priority
                />
            </Link>
        </section>
    );
}
