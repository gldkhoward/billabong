import Link from 'next/link';
import { PeopleAnimation } from '../components/PeopleAnimation';
import { ResidentCard } from './ResidentCard';

const residents = [
  {
    name: 'akshat',
    description: 'building arrayah',
    tags: ['infra', 'dev tools', 'systems'],
    image: '/arrayh_logo.jpg',
    position: { top: '5%', left: '5%' },
    rotation: -4,
    socials: {
      twitter: 'https://twitter.com/akshat',
      github: 'https://github.com/akshat',
      website: 'https://akshat.com',
    }
  },
  {
    name: 'luke',
    description: ' building the future of inventory management',
    tags: ['robotics', 'saas', 'ai'],
    image: '/luke.jpeg',
    position: { top: '2%', right: '5%' },
    rotation: 3,
    socials: {
      website: 'https://lukehoward.com.au',
      twitter: 'https://twitter.com/luke',
      github: 'https://github.com/luke',
      linkedin: 'https://linkedin.com/in/luke',
    }
  },
  {
    name: 'matty',
    description: 'crypto arbitrage',
    tags: ['crypto', 'design', 'collaboration'],
    image: '/arrayh_logo.jpg',
    position: { top: '30%', left: '8%' },
    rotation: -2,
    socials: {
      twitter: 'https://twitter.com/matty',
      website: 'https://matty.com',
      instagram: 'https://instagram.com/matty',
    }
  },
  {
    name: 'jack',
    description: 'building tempest ai',
    tags: ['gaming', 'ai', 'webdev'],
    image: '/jack.jpeg',
    position: { top: '33%', right: '8%' },
    rotation: 5,
    socials: {
      github: 'https://github.com/jack',
      linkedin: 'https://linkedin.com/in/jack',
      twitter: 'https://twitter.com/jack',
    }
  },
  {
    name: 'josh',
    description: 'making health data more accessible',
    tags: ['health tech', 'data', 'bio'],
    image: '/arrayh_logo.jpg',
    position: { top: '58%', left: '6%' },
    rotation: -3,
    socials: {
      twitter: 'https://twitter.com/josh',
      website: 'https://josh.com',
      linkedin: 'https://linkedin.com/in/josh',
    }
  },
  {
    name: 'kongwei',
    description: 'developing next-gen education platforms',
    tags: ['edtech', 'product', 'learning'],
    image: '/arrayh_logo.jpg',
    position: { top: '60%', right: '6%' },
    rotation: 2,
    socials: {
      twitter: 'https://twitter.com/kongwei',
      github: 'https://github.com/kongwei',
      linkedin: 'https://linkedin.com/in/kongwei',
    }
  },
  {
    name: 'rey',
    description: 'crafting experiences for the spatial web',
    tags: ['spatial', 'design', 'ar/vr'],
    image: '/arrayh_logo.jpg',
    position: { top: '85%', left: '35%' },
    rotation: -5,
    socials: {
      twitter: 'https://twitter.com/rey',
      instagram: 'https://instagram.com/rey',
      website: 'https://rey.com',
    }
  },
];

export default function Residents() {
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
      <main className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 min-h-[180vh]">
        {/* Center Animation - Outside container constraints */}
        <div 
          className="absolute top-[17%] left-1/2 pointer-events-none z-0 will-change-transform md:top-3/10" 
          style={{ 
            transform: 'translate(-50%, -50%)',
            width: '80vw',
            height: '80vh',
            opacity: 0.2
          }}
        >
          <PeopleAnimation />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-24 sm:mb-32">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-6xl text-[#0D1B2A] mb-4 sm:mb-6">
              residents
            </h1>
            <p className="font-body text-base sm:text-lg text-[#1A1A1A]/70 max-w-2xl mx-auto leading-relaxed">
              meet the builders, researchers, and creators currently calling billabong home.
            </p>
          </div>

          {/* Scattered Cards Container - Desktop scattered, Mobile stacked */}
          <div className="relative min-h-[120vh] sm:block flex flex-col items-center gap-8">
            {residents.map((resident, index) => (
              <ResidentCard key={index} resident={resident} />
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-16 sm:mt-24 text-center relative z-50">
            <div className="bg-[#E9DCC2]/20 rounded-xl p-6 sm:p-8 border border-[#6C8C64]/20">
              <p className="font-body text-sm sm:text-base text-[#1A1A1A]/70 leading-relaxed">
                interested in joining us?{' '}
                <a href="/apply" className="text-[#1F7A8C] hover:underline font-medium">
                  learn about residencies
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-[#1F7A8C]/10 py-6 sm:py-8 px-4 bg-[#F7F8F5]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-body text-xs sm:text-sm text-[#1A1A1A]/50">
            © {new Date().getFullYear()} billabong house
          </p>
        </div>
      </footer>
    </div>
  );
}
