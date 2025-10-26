import Link from "next/link";

export default function HouseRules() {
  const rules = [
    {
      title: "respect the space",
      description: "clean up after yourself. keep shared areas tidy and return items to their proper place. this is everyone's home.",
    },
    {
      title: "residents first",
      description: "be mindful that this is a home first, coworking space second. respect residents' privacy and comfort at all times.",
    },
    {
      title: "respect focus",
      description: "headphones or earphones mean do not disturb. when someone is locked in and working, let them maintain their flow state.",
    },
    {
      title: "quiet coworking",
      description: "coworking areas are for focused work. keep noise to a minimum. take calls, meetings, or socializing to common areas or outside.",
    },
    {
      title: "resident zones",
      description: "upper levels are for residents only unless you're invited up or accompanied by a resident. please respect these boundaries.",
    },
    {
      title: "kitchen access",
      description: "if you want to use the kichen, utensils or appliances, ask a resident and ensure you clean up after youself (wash your items, put them away, etc).",
    },
  ];

  return (
    <div className="water-dots min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#F7F8F5]/90 backdrop-blur-sm border-b border-[#1F7A8C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-heading font-bold text-xl text-[#0D1B2A]">
              billabong
            </Link>
            <Link 
              href="/"
              className="text-sm font-medium text-[#1A1A1A] hover:text-[#1F7A8C] transition-colors"
            >
              ← back
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-6xl text-[#0D1B2A] mb-4 sm:mb-6">
              house rules
            </h1>
            <p className="font-body text-base sm:text-lg text-[#1A1A1A]/70 max-w-2xl mx-auto leading-relaxed">
              simple guidelines to help everyone focus, create, and thrive together at billabong house.
            </p>
          </div>

          {/* Rules Grid */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 sm:p-8 border border-[#1F7A8C]/10 hover:border-[#1F7A8C]/30 transition-all hover:shadow-lg"
              >
                <h2 className="font-heading font-semibold text-xl sm:text-2xl text-[#0D1B2A] mb-3 sm:mb-4">
                  {rule.title}
                </h2>
                <p className="font-body text-sm sm:text-base text-[#1A1A1A]/80 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-[#E9DCC2]/20 rounded-xl p-6 sm:p-8 border border-[#6C8C64]/20">
              <p className="font-body text-sm sm:text-base text-[#1A1A1A]/70 leading-relaxed">
                these guidelines help create a space where everyone can do their best work. 
                questions? speak with a resident
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-[#1F7A8C]/10 py-8 px-4 bg-[#F7F8F5]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-body text-sm text-[#1A1A1A]/50">
            © {new Date().getFullYear()} billabong. part of arrayah.
          </p>
        </div>
      </footer>
    </div>
  );
}

