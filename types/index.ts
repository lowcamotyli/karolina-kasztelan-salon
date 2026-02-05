export interface TeamMember {
    name: string;
    role: string;
    image: string;
}

export interface PortfolioItem {
    title: string;
    category: string;
    image: string;
}

export interface Service {
    icon: string;
    label: string;
}

export interface BookingFormData {
    name: string;
    phone: string;
    service: string;
    date: string;
    time: string;
}

export interface ContactInfo {
    phone: string;
    email: string;
    address: string;
    city: string;
}

export interface SiteConfig {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    contact: ContactInfo;
    socialMedia: {
        instagram?: string;
        facebook?: string;
    };
    businessHours: {
        weekdays: string;
        saturday: string;
    };
}
