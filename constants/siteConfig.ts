import type { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
    siteName: 'Karolina Kasztelan Hair & Beauty',
    siteDescription:
        'Profesjonalny salon fryzjerski i kosmetyczny w Krakowie. Specjalizujemy się w koloryzacji, strzyżeniu, pielęgnacji włosów oraz makijażu.',
    siteUrl: 'https://karolinakasztelan.pl',
    contact: {
        phone: '12 413 32 03',
        email: 'karolina.kasztelan95@gmail.com',
        address: 'ul. Jerzego Bajana 4',
        city: '31-465 Kraków',
    },
    socialMedia: {
        instagram: '#',
        facebook: '#',
    },
    businessHours: {
        weekdays: '08:00 - 20:00',
        saturday: '08:00 - 15:00',
    },
};

export const seoMeta = {
    title: 'Karolina Kasztelan Hair & Beauty - Kraków',
    description: siteConfig.siteDescription,
    keywords:
        'fryzjer Kraków, salon piękności, koloryzacja, strzyżenie, makijaż, pielęgnacja włosów, salon fryzjerski',
    ogImage: '/og-image.jpg',
};
