import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { PortfolioItem } from '../types';

const items: PortfolioItem[] = [
  { title: 'Stylizacja 1', category: 'Hair', image: '/images/P1.jpeg' },
  { title: 'Stylizacja 2', category: 'Hair', image: '/images/P2.jpeg' },
  { title: 'Stylizacja 3', category: 'Makeup', image: '/images/P3.jpeg' },
  { title: 'Stylizacja 4', category: 'Hair', image: '/images/P4.jpeg' },
  { title: 'Stylizacja 5', category: 'Hair', image: '/images/P5.jpeg' },
  { title: 'Stylizacja 6', category: 'Makeup', image: '/images/P6.jpeg' },
  { title: 'Stylizacja 7', category: 'Hair', image: '/images/P7.jpeg' },
  { title: 'Stylizacja 8', category: 'Wedding', image: '/images/P8.jpeg' },
  { title: 'Stylizacja 9', category: 'Hair', image: '/images/P9.jpeg' },
  { title: 'Stylizacja 10', category: 'Makeup', image: '/images/p10.jpeg' },
  { title: 'Stylizacja 11', category: 'Hair', image: '/images/P11.jpeg' },
  { title: 'Stylizacja 12', category: 'Wedding', image: '/images/P12.jpeg' },
  { title: 'Stylizacja 13', category: 'Hair', image: '/images/P13.jpeg' },
  { title: 'Stylizacja 14', category: 'Makeup', image: '/images/P14.jpeg' },
  { title: 'Stylizacja 15', category: 'Hair', image: '/images/P15.jpeg' },
  { title: 'Stylizacja 16', category: 'Wedding', image: '/images/P16.jpeg' },
  { title: 'Stylizacja 17', category: 'Hair', image: '/images/P17.jpeg' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const Portfolio: React.FC = () => {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <section
      className="py-24 bg-background-light relative overflow-hidden"
      id="portfolio"
      aria-labelledby="portfolio-heading"
    >
      <div className="hidden xl:block absolute left-8 top-1/2 -translate-y-1/2 z-0">
        <span className="writing-vertical text-6xl text-accent-decorative/30 font-display">
          Gallery
        </span>
      </div>
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-primary uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
            Inspiracje
          </span>
          <h2
            id="portfolio-heading"
            className="font-display text-4xl lg:text-5xl text-black mb-6 font-light"
          >
            Nasze Prace
          </h2>
          <p className="text-text-light font-light text-lg leading-relaxed max-w-xl">
            Naturalne piękno i najnowsze trendy.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {items.map((item, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden aspect-[3/4] mb-6 rounded-sm">
                {imageErrors[index] ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Brak zdjęcia</span>
                  </div>
                ) : (
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    alt={`${item.title} - ${item.category}`}
                    className="w-full h-full object-cover"
                    src={item.image}
                    loading="lazy"
                    onError={() => handleImageError(index)}
                  />
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-6"
                >
                  <div className="text-white">
                    <motion.span
                      initial={{ y: 10, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      className="block text-xs font-bold tracking-widest uppercase mb-2"
                    >
                      {item.category}
                    </motion.span>
                    <motion.h3
                      initial={{ y: 10, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.05 }}
                      className="font-display text-xl"
                    >
                      {item.title}
                    </motion.h3>
                  </div>
                </motion.div>
              </div>
            </motion.article>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 border-b border-black text-black pb-1 hover:text-primary hover:border-primary transition-all text-xs uppercase tracking-widest"
          >
            Zobacz pełne portfolio
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;