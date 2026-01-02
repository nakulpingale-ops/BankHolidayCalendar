export default function TermsPage() {
    return (
        <div className="fixed inset-0 w-full h-full bg-[#01011c] z-40 overflow-y-auto">
            <div className="w-full min-h-screen pt-[120px] px-4 pb-20">
                <div className="max-w-[800px] mx-auto space-y-8">
                    <header className="space-y-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Terms of Service</h1>
                        <div className="h-1 w-20 bg-[#7d3cff] mx-auto rounded-full"></div>
                    </header>

                    <div className="prose prose-invert prose-lg mx-auto text-gray-300 leading-relaxed text-left">
                        <p>
                            By accessing <a href="https://www.google.com/search?q=BankHolidayCalendar.com" className="text-[#7d3cff] hover:underline">BankHolidayCalendar.com</a>, you agree to use this site for personal, non-commercial information purposes only.
                        </p>
                        <p>
                            While we aim for data accuracy based on official bank holiday gazettes, we are not liable for any financial losses or planning errors resulting from the use of our data.
                        </p>
                        <p>
                            All design elements and the 'HolBank' brand are the intellectual property of the owners. Unauthorized scraping or commercial reproduction of our holiday data is strictly prohibited.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
