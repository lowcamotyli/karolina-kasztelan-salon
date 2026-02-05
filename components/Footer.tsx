import React from 'react';
import { siteConfig } from '../constants/siteConfig';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-alt border-t border-gray-100 py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center gap-8">
          <a
            className="text-2xl font-display text-black tracking-wider flex flex-col items-center gap-2"
            href="#"
            aria-label="Powrót na górę strony"
          >
            <span className="font-normal">KAROLINA KASZTELAN</span>
            <span className="text-primary text-xs font-body font-light tracking-[0.3em] uppercase">
              Hair &amp; Beauty
            </span>
          </a>
          <nav aria-label="Social media links">
            <div className="flex gap-8">
              {siteConfig.socialMedia.instagram && (
                <a
                  className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-widest"
                  href={siteConfig.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Odwiedź nasz Instagram"
                >
                  Instagram
                </a>
              )}
              {siteConfig.socialMedia.facebook && (
                <a
                  className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-widest"
                  href={siteConfig.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Odwiedź nasz Facebook"
                >
                  Facebook
                </a>
              )}
            </div>
          </nav>
          <div className="mt-8 text-center text-xs text-gray-400 font-light tracking-wide">
            © {currentYear} {siteConfig.siteName}.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;