"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { bankHelplines } from "@/lib/bankHelplines";
import { Phone, ShieldAlert, CreditCard, LifeBuoy, Share2 } from "lucide-react";
import { BrandHeadline } from "@/components/BrandHeadline";

export function BankHelplinesClient() {
  const [search, setSearch] = useState("");

  const filteredBanks = bankHelplines.filter(bank =>
    bank.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#1A1A1A] text-white">
      {/* Hero Header Section */}
      <section className="max-w-[1050px] mx-auto px-4 py-16 md:py-24 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7d3cff]/10 border border-[#7d3cff]/20 text-[#7d3cff] text-xs font-bold uppercase tracking-widest mb-6">
          <ShieldAlert className="w-3.5 h-3.5" />
          Verified Financial Data
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-2 uppercase tracking-tighter leading-none">
          Bank Customer Care <span className="text-[#7d3cff]">Helplines</span>
        </h1>

        <p className="text-gray-400 text-[14px] leading-relaxed">
          Access verified helpline numbers for major banks across India.
          Quickly contact your bank for card blocking, fraud reporting,
          account support, and urgent banking issues.
        </p>

        <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <CreditCard className="w-4 h-4 text-[#7d3cff]" />
                Block Cards
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <ShieldAlert className="w-4 h-4 text-[#7d3cff]" />
                Report Fraud
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <LifeBuoy className="w-4 h-4 text-[#7d3cff]" />
                24/7 Support
            </div>
        </div>
      </section>

      {/* Grid & Search Section */}
      <section className="max-w-[1050px] mx-auto px-4 pb-12 -mt-[50px] relative z-10">
        <div className="mb-8 relative max-w-md">
            <input
                type="text"
                placeholder="Search bank..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-[#0E0E0E] text-white placeholder-gray-500 border focus:outline-none focus:ring-1 focus:ring-[#7D3CFF]"
                style={{ borderColor: "#7D3CFF" }}
            />
        </div>

        <div className="flex flex-col gap-5">
          {filteredBanks.map((bank) => (
            <div 
              key={bank.name} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border-[0.25px] w-full"
              style={{
                backgroundColor: "#0E0E0E",
                borderColor: "rgba(125, 60, 255, 0.45)"
               }}
            >
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={bank.logo}
                      alt={bank.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                    <span className="font-semibold text-gray-200">
                      {bank.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const text = `${bank.name} Helpline: ${bank.numbers ? bank.numbers.join(", ") : ""}`;
                      if (navigator.share) {
                        navigator.share({
                          title: "Bank Helpline",
                          text: text
                        }).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(text);
                        alert("Copied to clipboard!");
                      }
                    }}
                    className="text-[#7d3cff] hover:text-[#8b52ff] transition-colors p-2"
                    aria-label={`Share ${bank.name} helpline`}
                  >
                    <Share2 size={18} />
                  </button>
                </div>

                <div className="-mt-3 pl-[56px] flex flex-wrap gap-x-2 gap-y-1">
                  {bank.numbers && bank.numbers.length > 0 ? (
                    bank.numbers.map((num, i) => (
                      <React.Fragment key={i}>
                        <a 
                          href={`tel:${num.replace(/\s+/g, '')}`}
                          className="text-white text-sm hover:text-[#7d3cff] transition-colors underline decoration-white/20 underline-offset-4"
                        >
                          {num}
                        </a>
                        {i < bank.numbers.length - 1 && (
                          <span className="text-gray-500 text-sm self-center"> • </span>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <span className="text-white text-sm">No number</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note Section */}
        <div className="mt-16 w-full">
            <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-widest">Important Safety Note</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
                BankHolidayCalendar.com provides these numbers for reference only. Numbers are verified periodically via official bank websites. Always ensure you are speaking to an authorized bank representative. Never share your OTP, CVV, or PIN with anyone over the phone.
            </p>
        </div>

        <div className="mt-20">
            <BrandHeadline />
        </div>
      </section>
    </div>
  );
}
