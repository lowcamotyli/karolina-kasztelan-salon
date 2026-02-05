import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" id="about">
      <div className="hidden xl:block absolute left-8 top-1/2 -translate-y-1/2 z-10">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.4, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="writing-vertical text-6xl text-accent-decorative/40 font-display"
        >
          Beauty
        </motion.span>
      </div>
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="lg:w-1/2 space-y-10">
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-primary uppercase tracking-[0.3em] text-xs font-medium pl-1"
              >
                Kraków, Polska
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-display text-4xl md:text-5xl lg:text-7xl text-black leading-[1.1] font-light"
              >
                Karolina Kasztelan <br />
                <span className="italic text-primary-dark">Hair &amp; Beauty</span>
              </motion.h1>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-16 h-[1px] bg-black/20 origin-left"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-text-light font-light leading-loose max-w-lg"
            >
              W sercu Krakowa stworzyliśmy przestrzeń, gdzie piękno spotyka się z relaksem. Nasz
              salon to oaza spokoju, w której każdy zabieg staje się wyjątkowym rytuałem. Używamy
              tylko najwyższej jakości, naturalnych kosmetyków.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="pt-2"
            >
              <a
                className="group inline-flex items-center gap-3 text-black border-b border-black pb-1 uppercase tracking-widest text-xs hover:text-primary hover:border-primary transition-all duration-300"
                href="#booking"
              >
                Poznaj naszą ofertę
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </a>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:w-1/2 relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 bg-white p-4 shadow-sm"
            >
              {imageError ? (
                <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Nie udało się załadować obrazu</span>
                </div>
              ) : (
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  alt="Wnętrze nowoczesnego, luksusowego salonu piękności w Krakowie"
                  className="w-full h-[600px] object-cover filter brightness-[1.02] contrast-[0.95]"
                  src="/images/Salon1.jpeg"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute -top-6 -right-6 w-full h-full border border-primary/30 z-0"
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;