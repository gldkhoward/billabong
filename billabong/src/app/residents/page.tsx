import Link from 'next/link';
import { PeopleAnimation } from '../components/PeopleAnimation';
import { ResidentCard } from './ResidentCard';

const residents = [
  {
    name: 'akshat',
    description: 'founder of arrayah — building spaces where you can just do things',
    tags: ['community', 'startups', 'antler'],
    image: '/akshat.jpeg',
    rotation: -2.5,
    socials: {
      linkedin: 'https://www.linkedin.com/in/akshat418/'
    }
  },
  {
    name: 'luke',
    description: 'building the future of inventory management @ Lecxa',
    tags: ['robotics', 'saas', 'ai'],
    image: '/luke.jpeg',
    rotation: 1.5,
    socials: {
      website: 'https://lukehoward.com.au',
      github: 'https://github.com/gldkhoward',
      linkedin: 'https://www.linkedin.com/in/lukehowarduts/',
    }
  },
  {
    name: 'amanda',
    description: 'data scientist @ canva',
    tags: ['data science', 'ml', 'product'],
    image: '/amanda.jpeg',
    rotation: -1.5,
    socials: {
      linkedin: 'https://www.linkedin.com/in/amanda-de-silva-426010161/',
    }
  },
  {
    name: 'matty',
    description: 'software engineer & builder -> ex canva, relevance ai',
    tags: ['engineering', 'infra', 'fullstack'],
    image: '/matty.jpeg',
    rotation: 2,
    socials: {
      website: 'https://mattyhempstead.com',
      linkedin: 'https://www.linkedin.com/in/mattyhempstead/'
    }
  },
  {
    name: 'jack',
    description: 'building tempest ai -> ai for gaming',
    tags: ['gaming', 'ai', 'webdev'],
    image: '/jack.jpeg',
    rotation: -2,
    socials: {
      linkedin: 'https://www.linkedin.com/in/jack-wakem-ab7170230/',
    }
  },
  {
    name: 'josh',
    description: 'affiliate marketing & growth experiments',
    tags: ['marketing', 'growth', 'ecommerce'],
    image: '/josh.jpeg',
    rotation: 1.5,
    socials: {
      linkedin: 'https://www.linkedin.com/in/josh--neil/',
    }
  },
  {
    name: 'kongwei',
    description: 'building kairos lifemap, filtrum & deeply useful software tools',
    tags: ['product', 'design', 'philosophy'],
    image: '/arrayh_logo.jpg',
    rotation: -1,
    socials: {
      website: 'https://eusaybia.com',
      linkedin: 'https://www.linkedin.com/in/conwayying/',
    }
  },
  {
    name: 'rey',
    description: 'founder, angel investor & dj -> ex mckinsey, building toward systems change',
    tags: ['investing', 'health', 'systems'],
    image: '/rey.jpeg',
    rotation: 2.5,
    socials: {
      linkedin: 'https://www.linkedin.com/in/reynolds-tang-smith/'
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
      <main className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Animation */}
        <div 
          className="fixed inset-0 pointer-events-none z-0" 
          style={{ opacity: 0.08 }}
        >
          <PeopleAnimation />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#0D1B2A] mb-4 sm:mb-6">
              residents
            </h1>
            <p className="font-body text-base sm:text-lg text-[#1A1A1A]/70 max-w-2xl mx-auto leading-relaxed">
              meet the builders, researchers, and creators currently calling billabong home.
            </p>
          </div>

          {/* Responsive Grid Layout - with extra padding for organic card offsets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 px-2 sm:px-4">
            {residents.map((resident, index) => (
              <ResidentCard key={index} resident={resident} index={index} />
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-16 sm:mt-20 text-center">
            <div className="bg-[#E9DCC2]/20 rounded-xl p-6 sm:p-8 border border-[#6C8C64]/20">
              <p className="font-body text-sm sm:text-base text-[#1A1A1A]/70 leading-relaxed">
                interested in joining us?{' '}
                <a href="https://arrayah.city/#residency" className="text-[#1F7A8C] hover:underline font-medium">
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
