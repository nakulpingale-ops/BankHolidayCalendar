import { Inter_Tight } from "next/font/google";

const interTight = Inter_Tight({ subsets: ["latin"], weight: "700" });

export function FooterBranding() {
    return (
        <div className={`w-full max-w-full mx-auto px-4 mt-12 mb-0 select-none overflow-hidden ${interTight.className}`}>
            <div className="flex justify-center w-full">
                <div className="flex items-start gap-[1.5vw] md:gap-[1vw]">
                    <span className="text-[5vw] md:text-[3vw] font-light text-gray-500 leading-none mt-[1vw] md:mt-[0.5vw] ml-[20px]">a</span>
                    <div className="flex flex-col">
                        <div className="flex items-center leading-none">
                            <span className="text-[15vw] md:text-[12vw] font-bold text-white tracking-tighter">HOL</span>
                            <span className="text-[15vw] md:text-[12vw] font-bold text-[#7d3cff] tracking-tighter">BANK</span>
                        </div>
                        <div className="text-right -mt-[2vw] md:-mt-[1.5vw] -translate-y-[20px]">
                            <span className="text-[5vw] md:text-[3vw] font-light text-gray-500 tracking-wide">product</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
