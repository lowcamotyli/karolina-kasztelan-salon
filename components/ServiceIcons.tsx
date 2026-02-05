import React from 'react';
import type { Service } from '../types';

const services: Service[] = [
  { icon: 'content_cut', label: 'Strzyżenie' },
  { icon: 'brush', label: 'Koloryzacja' },
  { icon: 'spa', label: 'Pielęgnacja' },
  { icon: 'face_3', label: 'Makijaż' },
  { icon: 'diamond', label: 'Stylizacja' },
];

const ServiceIcons: React.FC = () => {
  return (
    <section className="py-16 bg-background-alt border-y border-white" aria-label="Nasze usługi">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 text-center group cursor-pointer"
            >
              <span
                className="material-symbols-outlined text-4xl font-thin text-gray-700 group-hover:text-primary transition-colors"
                aria-hidden="true"
              >
                {service.icon}
              </span>
              <span className="text-xs uppercase tracking-widest text-gray-500">
                {service.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceIcons;