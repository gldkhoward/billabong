'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GuestDialog } from './GuestDialog';
import { KayakAnimation } from '../components/KayakAnimation';

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  x_handle: string | null;
  website_url: string | null;
  homie_image_url: string | null;
  where_from: string | null;
  why_billabong: string | null;
  working_on: string | null;
  how_to_help: string | null;
  is_active: boolean;
  checkin_at: string | null;
}

// Generate random positions for active orbs
const generateOrbPositions = (count: number) => {
  const positions = [];
  const usedPositions: { x: number; y: number }[] = [];
  
  for (let i = 0; i < count; i++) {
    let position;
    let attempts = 0;
    
    do {
      const x = 10 + Math.random() * 80;
      const y = 10 + Math.random() * 80;
      position = { x, y };
      attempts++;
      
      const isTooClose = usedPositions.some(used => {
        const distance = Math.sqrt(Math.pow(used.x - x, 2) + Math.pow(used.y - y, 2));
        return distance < 15;
      });
      
      if (!isTooClose || attempts > 50) {
        usedPositions.push(position);
        break;
      }
    } while (attempts < 50);
    
    positions.push(position);
  }
  
  return positions;
};

// DVD Bouncing Orb Component
function BouncingOrb({ guest, containerRef, onClick }: { guest: Guest; containerRef: React.RefObject<HTMLDivElement | null>; onClick: () => void }) {
  const orbRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState(() => ({ 
    x: Math.random() * 80 + 10, 
    y: Math.random() * 80 + 10 
  }));
  const [velocity, setVelocity] = useState(() => ({ 
    x: (Math.random() - 0.5) * 0.5, 
    y: (Math.random() - 0.5) * 0.5 
  }));

  useEffect(() => {
    if (!containerRef.current || !orbRef.current) return;

    const animate = () => {
      if (!containerRef.current || !orbRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const orbWidth = orbRef.current.offsetWidth;
      const orbHeight = orbRef.current.offsetHeight;

      setPosition(prev => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;

        // Convert percentage to pixels for bounce detection
        const xPx = (newX / 100) * containerWidth;
        const yPx = (newY / 100) * containerHeight;

        // Bounce off walls
        if (xPx <= 0 || xPx + orbWidth >= containerWidth) {
          newVelX = -newVelX;
          newX = xPx <= 0 ? 0 : ((containerWidth - orbWidth) / containerWidth) * 100;
        }
        if (yPx <= 0 || yPx + orbHeight >= containerHeight) {
          newVelY = -newVelY;
          newY = yPx <= 0 ? 0 : ((containerHeight - orbHeight) / containerHeight) * 100;
        }

        if (newVelX !== velocity.x || newVelY !== velocity.y) {
          setVelocity({ x: newVelX, y: newVelY });
        }

        return { x: newX, y: newY };
      });
    };

    const intervalId = setInterval(animate, 16); // ~60fps
    return () => clearInterval(intervalId);
  }, [velocity, containerRef]);

  return (
    <button
      ref={orbRef}
      onClick={onClick}
      className="absolute group cursor-pointer transition-transform hover:scale-110"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      <div className="relative bg-linear-to-br from-charcoal/30 to-charcoal/40 rounded-full shadow-md w-14 h-14 sm:w-16 sm:h-16 opacity-60 hover:opacity-80 transition-opacity overflow-hidden">
        {guest.homie_image_url ? (
          <img 
            src={guest.homie_image_url} 
            alt={`${guest.first_name} ${guest.last_name}`}
            className="w-full h-full object-cover grayscale"
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center text-charcoal/60 font-heading font-bold text-lg sm:text-xl z-10">
            {guest.first_name[0]}{guest.last_name[0]}
          </div>
        )}
      </div>
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-md font-heading font-semibold text-xs text-charcoal/70 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
        {guest.first_name} {guest.last_name}
      </div>
    </button>
  );
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [orbPositions, setOrbPositions] = useState<{ x: number; y: number }[]>([]);
  const bottomContainerRef = useRef<HTMLDivElement>(null);

  const activeGuests = guests.filter(g => g.is_active);
  const inactiveGuests = guests.filter(g => !g.is_active);

  useEffect(() => {
    fetchGuests();
  }, []);

  useEffect(() => {
    if (activeGuests.length > 0) {
      setOrbPositions(generateOrbPositions(activeGuests.length));
    }
  }, [activeGuests.length]);

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/guests/active');
      if (response.ok) {
        const data = await response.json();
        setGuests(data);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const orbColors = [
    'from-river-teal to-deep-indigo',
    'from-eucalyptus to-river-teal',
    'from-sand to-eucalyptus',
    'from-deep-indigo to-river-teal',
    'from-river-teal to-eucalyptus',
  ];

  return (
    <div className="water-dots h-screen flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-foam/90 backdrop-blur-sm border-b border-river-teal/10 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-heading font-bold text-xl text-deep-indigo">
              billabong
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="text-sm font-medium text-charcoal hover:text-river-teal transition-colors"
              >
                ← back
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Split Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Half - Active Guests */}
        <div className="h-1/2 relative border-b-2 border-river-teal/20 bg-foam/30">
          {/* Background Animation */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <KayakAnimation />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="text-center py-6 px-4">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-deep-indigo mb-2">
                currently here 🌊
              </h2>
              <p className="font-body text-sm text-charcoal/80">
                {loading ? 'loading...' : activeGuests.length === 0 ? 'no one is here right now' : `${activeGuests.length} ${activeGuests.length === 1 ? 'person' : 'people'} here now`}
              </p>
            </div>

            {/* Floating Active Orbs */}
            {!loading && activeGuests.length > 0 && (
              <div className="flex-1 relative">
                {activeGuests.map((guest, index) => {
                  const position = orbPositions[index] || { x: 50, y: 50 };
                  const colorClass = orbColors[index % orbColors.length];
                  const delay = index * 0.1;
                  
                  return (
                    <button
                      key={guest.id}
                      onClick={() => setSelectedGuest(guest)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        animation: `float-${index % 3} ${3 + (index % 3)}s ease-in-out infinite`,
                        animationDelay: `${delay}s`,
                      }}
                    >
                      <div className={`relative bg-linear-to-br ${colorClass} rounded-full shadow-lg transition-all duration-300 ease-out group-hover:scale-125 group-hover:shadow-2xl w-16 h-16 sm:w-20 sm:h-20 overflow-hidden`}>
                        <div className={`absolute inset-0 rounded-full bg-linear-to-br ${colorClass} opacity-50 animate-ping-slow group-hover:animate-none`} />
                        {guest.homie_image_url ? (
                          <img 
                            src={guest.homie_image_url} 
                            alt={`${guest.first_name} ${guest.last_name}`}
                            className="relative w-full h-full object-cover z-10"
                          />
                        ) : (
                          <div className="relative w-full h-full flex items-center justify-center text-white font-heading font-bold text-xl sm:text-2xl z-10">
                            {guest.first_name[0]}{guest.last_name[0]}
                          </div>
                        )}
                      </div>
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-md font-heading font-semibold text-sm text-deep-indigo opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                        {guest.first_name} {guest.last_name}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeGuests.length === 0 && !loading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">🏖️</div>
                  <p className="font-body text-charcoal/60">The space is quiet right now</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Half - Inactive Guests (DVD Bounce) */}
        <div className="h-1/2 relative bg-charcoal/5">
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="text-center py-6 px-4">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-charcoal/70 mb-2">
                past guests 👋
              </h2>
              <p className="font-body text-sm text-charcoal/60">
                {loading ? 'loading...' : inactiveGuests.length === 0 ? 'no past guests yet' : `${inactiveGuests.length} ${inactiveGuests.length === 1 ? 'person has' : 'people have'} visited before`}
              </p>
            </div>

            {/* Bouncing Inactive Orbs */}
            {!loading && inactiveGuests.length > 0 && (
              <div ref={bottomContainerRef} className="flex-1 relative overflow-hidden">
                {inactiveGuests.map((guest) => (
                  <BouncingOrb
                    key={guest.id}
                    guest={guest}
                    containerRef={bottomContainerRef}
                    onClick={() => setSelectedGuest(guest)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guest Dialog */}
      <GuestDialog guest={selectedGuest} onClose={() => setSelectedGuest(null)} />

      {/* Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-0 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-20px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-15px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-25px); }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}} />
    </div>
  );
}
