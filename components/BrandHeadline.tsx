import { cn } from "@/lib/utils";

export function BrandHeadline() {
    return (
        <section className="w-screen max-w-none relative left-1/2 -translate-x-1/2 z-0 flex justify-center -mb-6 md:-mb-10 overflow-hidden pointer-events-none select-none">
            <h1 className="text-[22vw] leading-[0.8] tracking-tighter text-center">
                <span className="text-white font-normal">HOL</span>
                <span className="text-[#7d3cff] font-extrabold">BANK</span>
            </h1>
        </section>
    );
}
