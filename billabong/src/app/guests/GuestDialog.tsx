'use client';

import { useEffect } from 'react';
import Image from 'next/image';

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
  is_active?: boolean;
  checkin_at: string | null;
}

interface GuestDialogProps {
  guest: Guest | null;
  onClose: () => void;
}

const getSocialIcon = (platform: string) => {
  const icons = {
    x: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    github: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    website: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  };
  return icons[platform as keyof typeof icons] || null;
};

export function GuestDialog({ guest, onClose }: GuestDialogProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (guest) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [guest, onClose]);

  if (!guest) return null;

  const socials = [
    { platform: 'github', url: guest.github_url },
    { platform: 'linkedin', url: guest.linkedin_url },
    { platform: 'instagram', url: guest.instagram_url },
    { platform: 'x', url: guest.x_handle ? `https://twitter.com/${guest.x_handle.replace('@', '')}` : null },
    { platform: 'website', url: guest.website_url },
  ].filter(s => s.url);

  const checkinTime = guest.checkin_at ? new Date(guest.checkin_at) : null;
  const timeAgo = checkinTime ? formatTimeAgo(checkinTime) : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-linear-to-br from-river-teal to-eucalyptus p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center text-3xl font-bold overflow-hidden">
              {guest.homie_image_url ? (
                <img 
                  src={guest.homie_image_url} 
                  alt={`${guest.first_name} ${guest.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{guest.first_name[0]}{guest.last_name[0]}</span>
              )}
            </div>
            <div>
              <h2 className="font-heading font-bold text-3xl mb-1">
                {guest.first_name} {guest.last_name}
              </h2>
              {guest.where_from && (
                <p className="text-white/90 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {guest.where_from}
                </p>
              )}
              {timeAgo && (
                <p className="text-white/80 text-sm mt-1">
                  Checked in {timeAgo}
                </p>
              )}
              {!guest.is_active && (
                <p className="text-white/80 text-sm mt-1">
                  Past guest
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Why Billabong */}
          {guest.why_billabong && (
            <div>
              <h3 className="font-heading font-semibold text-lg text-deep-indigo mb-2 flex items-center gap-2">
                <span className="text-2xl">🌊</span>
                Why Billabong?
              </h3>
              <p className="font-body text-charcoal/80 leading-relaxed">
                {guest.why_billabong}
              </p>
            </div>
          )}

          {/* Working On */}
          {guest.working_on && (
            <div>
              <h3 className="font-heading font-semibold text-lg text-deep-indigo mb-2 flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Currently Working On
              </h3>
              <p className="font-body text-charcoal/80 leading-relaxed">
                {guest.working_on}
              </p>
            </div>
          )}

          {/* How to Help */}
          {guest.how_to_help && (
            <div>
              <h3 className="font-heading font-semibold text-lg text-deep-indigo mb-2 flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                How You Can Help
              </h3>
              <p className="font-body text-charcoal/80 leading-relaxed">
                {guest.how_to_help}
              </p>
            </div>
          )}

          {/* Social Links */}
          {socials.length > 0 && (
            <div>
              <h3 className="font-heading font-semibold text-lg text-deep-indigo mb-3">
                Connect
              </h3>
              <div className="flex flex-wrap gap-2">
                {socials.map(({ platform, url }) => (
                  <a
                    key={platform}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-river-teal/10 hover:bg-river-teal hover:text-white text-river-teal rounded-lg transition-all duration-200 font-medium text-sm"
                  >
                    {getSocialIcon(platform)}
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}} />
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

