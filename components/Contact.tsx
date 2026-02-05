import React, { useState } from 'react';
import { siteConfig } from '../constants/siteConfig';

const Contact: React.FC = () => {
  const [mapError, setMapError] = useState(false);

  return (
    <section className="py-24 bg-white" id="location">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3 space-y-10">
            <div>
              <h2 className="font-display text-4xl text-black mb-2">Kontakt</h2>
              <div className="w-12 h-px bg-primary"></div>
            </div>
            <div className="space-y-8 font-light">
              <div className="flex flex-col gap-2">
                <h4 className="font-normal text-black uppercase text-xs tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">location_on</span> Adres
                </h4>
                <p className="text-text-light pl-7">
                  {siteConfig.contact.address}
                  <br />
                  {siteConfig.contact.city}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-normal text-black uppercase text-xs tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">call</span> Telefon
                </h4>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                  className="text-text-light pl-7 hover:text-primary transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-normal text-black uppercase text-xs tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">mail</span> Email
                </h4>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-text-light pl-7 hover:text-primary transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 h-[450px] w-full bg-gray-50 p-4">
            {mapError ? (
              <div className="w-full h-full flex items-center justify-center border border-gray-100 bg-gray-50">
                <div className="text-center px-6">
                  <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">
                    location_off
                  </span>
                  <p className="text-gray-500">
                    Nie udało się załadować mapy.
                    <br />
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(
                        siteConfig.contact.address + ', ' + siteConfig.contact.city
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Otwórz w Google Maps
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                allowFullScreen={true}
                className="grayscale hover:grayscale-0 transition-all duration-700 w-full h-full border border-gray-100"
                loading="lazy"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2561.0827107775567!2d19.95758417688537!3d50.06646531535497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47165b6f3c023d51%3A0x7e8b846e96472251!2sJerzego%20Bajana%204%2C%2031-465%20Krak%C3%B3w!5e0!3m2!1sen!2spl!4v1715694827263!5m2!1sen!2spl"
                style={{ border: 0 }}
                title="Lokalizacja salonu na mapie"
                onError={() => setMapError(true)}
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;