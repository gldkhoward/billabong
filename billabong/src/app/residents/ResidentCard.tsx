'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ResidentCardProps {
  resident: {
    name: string;
    description: string;
    tags: string[];
    image: string;
    rotation: number;
    socials: {
      twitter?: string;
      github?: string;
      linkedin?: string;
      instagram?: string;
      website?: string;
    };
  };
  index: number;
}

const getSocialIcon = (platform: string) => {
  const icons = {
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    website: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  };
  return icons[platform as keyof typeof icons] || null;
};

export function ResidentCard({ resident, index }: ResidentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Create organic offsets based on index for that hand-placed feel
  // Alternating pattern creates visual interest without chaos
  const offsets = [
    { x: 0, y: 0 },      // 0: centered
    { x: 8, y: -6 },     // 1: nudged right, up
    { x: -6, y: 4 },     // 2: nudged left, down
    { x: 4, y: -8 },     // 3: slight right, up more
    { x: -8, y: 6 },     // 4: left, down
    { x: 6, y: 2 },      // 5: right, slight down
    { x: -4, y: -4 },    // 6: left, up
    { x: 10, y: 8 },     // 7: right, down
  ];
  const offset = offsets[index % offsets.length];

  return (
    <div
      className="group transition-all duration-300 ease-out will-change-transform"
      style={{
        transform: isHovered 
          ? 'rotate(0deg) scale(1.05) translateY(-4px)' 
          : `rotate(${resident.rotation}deg) translate(${offset.x}px, ${offset.y}px)`,
        zIndex: isHovered ? 50 : 10,
        // Stagger fade-in animation
        animation: 'fadeIn 0.5s ease-out forwards',
        animationDelay: `${index * 80}ms`,
        opacity: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`
          relative bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border-2 border-[#1F7A8C]/20
          transition-all duration-300 ease-out cursor-pointer h-full
          ${isHovered ? 'shadow-2xl border-[#1F7A8C]/50 -translate-y-1' : 'shadow-lg'}
        `}
      >
        {/* Animated corner accent */}
        <div 
          className={`
            absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#1F7A8C]/10 to-transparent rounded-bl-3xl rounded-tr-2xl
            transition-all duration-300
            ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}
          `}
        />
        
        {/* Profile Picture */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 relative"
              style={{
                borderColor: isHovered ? '#1F7A8C' : 'rgba(31, 122, 140, 0.3)',
                transform: isHovered ? 'scale(1.08) rotate(3deg)' : 'scale(1) rotate(0deg)',
              }}
            >
              <Image 
                src={resident.image} 
                alt={resident.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 64px, 80px"
              />
            </div>
          </div>
          
          {/* Name and underline */}
          <div className="flex-1 min-w-0 pt-1 sm:pt-2">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#0D1B2A] mb-1.5 truncate">
              {resident.name}
            </h2>
            <div 
              className={`
                h-0.5 sm:h-1 bg-gradient-to-r from-[#1F7A8C] to-[#6C8C64] rounded-full transition-all duration-300
                ${isHovered ? 'w-full' : 'w-10 sm:w-12'}
              `}
            />
          </div>
        </div>

        {/* Description */}
        <p className="font-body text-sm text-[#1A1A1A]/80 leading-relaxed mb-4">
          {resident.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {resident.tags.map((tag, tagIdx) => (
            <span 
              key={tagIdx}
              className={`
                px-2.5 py-1 bg-[#1F7A8C]/10 text-[#1F7A8C] rounded-full text-xs font-medium
                transition-all duration-200
                ${isHovered ? 'bg-[#1F7A8C]/20' : ''}
              `}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex gap-2 pt-4 border-t border-[#1F7A8C]/10">
          {Object.entries(resident.socials).map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                p-2 rounded-lg transition-all duration-200
                ${isHovered 
                  ? 'bg-[#1F7A8C] text-white shadow-lg scale-110' 
                  : 'bg-[#1F7A8C]/10 text-[#1F7A8C] hover:bg-[#1F7A8C]/20'
                }
              `}
              aria-label={platform}
              onClick={(e) => e.stopPropagation()}
            >
              {getSocialIcon(platform)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

