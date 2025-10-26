export default function HouseRules() {
  const rules = [
    {
      title: "Respect the Space",
      description: "Clean up after yourself. Keep shared areas tidy and return items to their proper place. This is everyone's home.",
    },
    {
      title: "Residents First",
      description: "Be mindful that this is a home first, coworking space second. Respect residents' privacy and comfort at all times.",
    },
    {
      title: "Honor Focus Time",
      description: "Headphones or earphones mean do not disturb. When someone is locked in and working, let them maintain their flow state.",
    },
    {
      title: "Quiet Coworking",
      description: "Coworking areas are for focused work. Keep noise to a minimum. Take calls and meetings to common areas or living room tables.",
    },
    {
      title: "Resident Zones",
      description: "Upper levels are for residents only unless you're invited up or accompanied by a resident. Please respect these boundaries.",
    },
    {
      title: "Kitchen Access",
      description: "Non-residents should use the fridge in the coworking area. Residents have designated spaces in the main kitchen.",
    },
  ];

  return (
    <div className="water-dots min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#F7F8F5]/90 backdrop-blur-sm border-b border-[#1F7A8C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="font-heading font-bold text-xl text-[#0D1B2A]">
              Billabong
            </a>
            <a 
              href="/"
              className="text-sm font-medium text-[#1A1A1A] hover:text-[#1F7A8C] transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-heading font-bold text-5xl sm:text-6xl text-[#0D1B2A] mb-6">
              House Rules
            </h1>
            <p className="font-body text-lg text-[#1A1A1A]/70 max-w-2xl mx-auto leading-relaxed">
              Simple guidelines to help everyone focus, create, and thrive together at Billabong House.
            </p>
          </div>

          {/* Rules Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 border border-[#1F7A8C]/10 hover:border-[#1F7A8C]/30 transition-all hover:shadow-lg"
              >
                <h2 className="font-heading font-semibold text-2xl text-[#0D1B2A] mb-4">
                  {rule.title}
                </h2>
                <p className="font-body text-[#1A1A1A]/80 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <div className="bg-[#E9DCC2]/20 rounded-xl p-8 border border-[#6C8C64]/20">
              <p className="font-body text-[#1A1A1A]/70 leading-relaxed">
                These guidelines help create a space where everyone can do their best work. 
                Questions? Speak with a resident or reach out to{' '}
                <a href="mailto:hello@billabong.house" className="text-[#1F7A8C] hover:underline">
                  hello@billabong.house
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-[#1F7A8C]/10 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-body text-sm text-[#1A1A1A]/50">
            © {new Date().getFullYear()} Billabong House. Part of Arrayah.
          </p>
        </div>
      </footer>
    </div>
  );
}

