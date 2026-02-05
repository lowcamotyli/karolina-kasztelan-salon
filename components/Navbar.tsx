import React, { useState, useEffect, useRef } from 'react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Focus trap in mobile menu
  useEffect(() => {
    if (isMobileMenuOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      };

      document.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isMobileMenuOpen]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 h-24 flex items-center transition-all duration-300 ${isScrolled
          ? 'bg-background-light/98 backdrop-blur-xl border-b border-border-color shadow-lg'
          : 'bg-background-light/95 backdrop-blur-md border-b border-border-color'
        }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center h-full">
        <a className="flex items-center gap-3 h-full py-2 group" href="#" aria-label="Strona główna">
          <div className="flex items-center gap-3">
            <img
              alt="KK Hair & Beauty Logo"
              className="h-10 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              src="/images/Logo.jpg"
              loading="lazy"
            />
            <div className="hidden lg:flex flex-col justify-center">
              <span className="font-display text-lg tracking-widest leading-none text-black">
                KK HAIR &amp; BEAUTY
              </span>
            </div>
          </div>
        </a>

        <div className="hidden md:flex space-x-10 items-center">
          <a
            className="text-xs uppercase tracking-super-wide hover:text-primary transition-colors text-text-main/80"
            href="#about"
          >
            O Nas
          </a>
          <a
            className="text-xs uppercase tracking-super-wide hover:text-primary transition-colors text-text-main/80"
            href="#team"
          >
            Zespół
          </a>
          <a
            className="text-xs uppercase tracking-super-wide hover:text-primary transition-colors text-text-main/80"
            href="#portfolio"
          >
            Galeria
          </a>
          <a
            className="text-xs uppercase tracking-super-wide hover:text-primary transition-colors text-text-main/80"
            href="#booking"
          >
            Rezerwacja
          </a>
          <a
            className="text-xs uppercase tracking-super-wide hover:text-primary transition-colors text-text-main/80"
            href="#location"
          >
            Kontakt
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="#booking"
            className="hidden lg:block border border-black px-6 py-2 hover:bg-black hover:text-white transition-all text-xs uppercase tracking-widest duration-300"
          >
            Umów Wizytę
          </a>
          <button
            ref={buttonRef}
            className="md:hidden text-black"
            onClick={handleMenuToggle}
            aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
          {/* Menu */}
          <div
            ref={menuRef}
            id="mobile-menu"
            className="absolute top-24 left-0 w-full bg-background-light border-b border-border-color md:hidden flex flex-col items-center py-6 space-y-4 shadow-lg z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Menu nawigacji mobilnej"
          >
            <a
              className="text-xs uppercase tracking-widest hover:text-primary"
              href="#about"
              onClick={closeMenu}
            >
              O Nas
            </a>
            <a
              className="text-xs uppercase tracking-widest hover:text-primary"
              href="#team"
              onClick={closeMenu}
            >
              Zespół
            </a>
            <a
              className="text-xs uppercase tracking-widest hover:text-primary"
              href="#portfolio"
              onClick={closeMenu}
            >
              Galeria
            </a>
            <a
              className="text-xs uppercase tracking-widest hover:text-primary"
              href="#booking"
              onClick={closeMenu}
            >
              Rezerwacja
            </a>
            <a
              className="text-xs uppercase tracking-widest hover:text-primary"
              href="#location"
              onClick={closeMenu}
            >
              Kontakt
            </a>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;