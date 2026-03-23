import React, { useState } from 'react';
import type { TeamMember } from '../types';

const teamMembers: TeamMember[] = [
  {
    name: 'Karolina',
    role: 'Master Stylist',
    image: '/images/K3.jpeg',
  },
  {
    name: 'Ela',
    role: 'Senior Stylist',
    image: '/images/Ela.jpeg',
  },
  {
    name: 'Monika',
    role: 'Stylist',
    image: '/images/M2.jpeg',
  },
  {
    name: 'Patrycja',
    role: 'Stylistka paznokci',
    image: '/images/Patrycja.jpg',
  },
];

const Team: React.FC = () => {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <section
      className="py-24 bg-background-light relative overflow-hidden"
      id="team"
      aria-labelledby="team-heading"
    >
      <div className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 z-0">
        <span className="writing-vertical text-6xl text-accent-decorative/30 font-display rotate-180">
          Experts
        </span>
      </div>
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="text-primary uppercase tracking-[0.2em] text-xs font-bold mb-4 block">
            Nasi Eksperci
          </span>
          <h2
            id="team-heading"
            className="font-display text-4xl md:text-5xl text-black mb-6 font-light"
          >
            Poznaj Zespół
          </h2>
          <div className="w-12 h-px bg-primary mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="group text-center">
              <div className="relative overflow-hidden mb-8 mx-auto w-full aspect-[3/4] max-w-[280px]">
                {imageErrors[index] ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Brak zdjęcia</span>
                  </div>
                ) : (
                  <img
                    alt={`Portret ${member.name} - ${member.role}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    src={member.image}
                    loading="lazy"
                    onError={() => handleImageError(index)}
                  />
                )}
                <div className="absolute inset-0 border border-transparent group-hover:border-primary/20 transition-colors duration-500 m-2"></div>
              </div>
              <h3 className="font-display text-2xl text-black mb-2 group-hover:text-primary transition-colors">
                {member.name}
              </h3>
              <p className="text-xs uppercase tracking-super-wide text-gray-500 mb-4">
                {member.role}
              </p>
              <a
                className="text-xs uppercase tracking-widest border-b border-gray-200 hover:border-black pb-1 transition-colors"
                href="#booking"
              >
                Rezerwuj
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
