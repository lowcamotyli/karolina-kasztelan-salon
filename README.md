# Karolina Kasztelan Hair & Beauty - Salon Website

[![License](https://img.shields.io/badge/license-Private-red.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg)](https://vitejs.dev/)

Profesjonalny salon fryzjerski i kosmetyczny w Krakowie - nowoczesna strona internetowa z najwyższymi standardami bezpieczeństwa, dostępności i jakości kodu.

## 🌐 Live Demo

🚀 **Production**: [Strona będzie dostępna po deployment]

## ✨ Funkcjonalności

### 🎨 Premium Design
- Elegancki, minimalistyczny design w stylu "quiet luxury"
- Responsywny layout dostosowany do wszystkich urządzeń
- Profesjonalna paleta kolorów (beige/neutral)
- Wysokiej jakości zdjęcia i grafiki

### 🔒 Bezpieczeństwo
- ✅ Content Security Policy (CSP)
- ✅ Zabezpieczone nagłówki HTTP
- ✅ Brak eksponowania kluczy API w kliencie
- ✅ Lokalne zależności (bez CDN w produkcji)
- ✅ 0 vulnerabilities

### ♿ Dostępność (a11y)
- ✅ ARIA labels i atrybuty
- ✅ Obsługa klawiatury (keyboard navigation)
- ✅ Focus management (focus trap w mobile menu)
- ✅ Screen reader friendly
- ✅ Semantic HTML5

### 📱 SEO
- ✅ Meta tagi (description, keywords)
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Canonical URL
- ✅ robots.txt
- ✅ Sitemap ready

### 📋 Sekcje strony
1. **Hero** - Efektowna sekcja powitalna
2. **Usługi** - Ikony usług salonowych
3. **Zespół** - Prezentacja ekspertów
4. **Rezerwacja** - Formularz z pełną walidacją
5. **Portfolio** - Galeria prac
6. **Kontakt** - Mapa i dane kontaktowe

### 🛡️ Jakość kodu
- ✅ TypeScript dla type safety
- ✅ ESLint + Prettier
- ✅ React Hook Form + Zod validation
- ✅ Error Boundaries
- ✅ Proper error handling

## 🚀 Technologie

### Core
- **React 19** - Biblioteka UI
- **TypeScript 5.8** - Statyczne typowanie
- **Vite 6.2** - Build tool & dev server

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Custom CSS** - Dodatkowe style

### Walidacja & Formularze
- **React Hook Form 7.49** - Zarządzanie formularzami
- **Zod 3.22** - Schema validation
- **@hookform/resolvers** - Integracja

### Jakość kodu
- **ESLint 8.56** - Linting
- **Prettier 3.2** - Code formatting
- **TypeScript ESLint** - TypeScript linting

## 📦 Instalacja

### Wymagania
- Node.js >= 18.0.0
- npm >= 9.0.0

### Kroki instalacji

1. **Sklonuj repozytorium**
```bash
git clone https://github.com/JinSakai8/karolina-kasztelan-salon.git
cd karolina-kasztelan-salon
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Skonfiguruj zmienne środowiskowe**
```bash
cp .env.example .env.local
```

Edytuj `.env.local` i uzupełnij dane:
```env
GEMINI_API_KEY=your_api_key_here
VITE_CONTACT_PHONE="+48 123 456 789"
VITE_CONTACT_EMAIL="kontakt@karolinakasztelan.pl"
VITE_CONTACT_ADDRESS="ul. Jerzego Bajana 4"
VITE_CONTACT_CITY="31-465 Kraków"
```

4. **Uruchom serwer deweloperski**
```bash
npm run dev
```

Strona będzie dostępna pod adresem: `http://localhost:3000`

## 🛠️ Dostępne skrypty

```bash
# Uruchom serwer deweloperski (port 3000)
npm run dev

# Zbuduj wersję produkcyjną
npm run build

# Podgląd buildu produkcyjnego
npm run preview

# Sprawdź błędy TypeScript
npm run type-check

# Uruchom linter
npm run lint

# Formatuj kod
npm run format
```

## 📂 Struktura projektu

```
karolina-kasztelan-salon/
├── components/              # Komponenty React
│   ├── Navbar.tsx          # Nawigacja z mobile menu
│   ├── Hero.tsx            # Sekcja powitalna
│   ├── ServiceIcons.tsx    # Ikony usług
│   ├── Team.tsx            # Prezentacja zespołu
│   ├── Booking.tsx         # Formularz rezerwacji
│   ├── Portfolio.tsx       # Galeria prac
│   ├── Contact.tsx         # Kontakt i mapa
│   ├── Footer.tsx          # Stopka
│   └── ErrorBoundary.tsx   # Obsługa błędów
├── constants/              # Stałe i konfiguracja
│   └── siteConfig.ts       # Centralna konfiguracja
├── types/                  # Definicje TypeScript
│   └── index.ts            # Typy i interfejsy
├── public/                 # Pliki statyczne
│   └── robots.txt          # SEO robots
├── .eslintrc.cjs          # Konfiguracja ESLint
├── .prettierrc            # Konfiguracja Prettier
├── .gitignore             # Git ignore rules
├── .env.example           # Template zmiennych środowiskowych
├── index.html             # Główny plik HTML
├── index.css              # Globalne style
├── index.tsx              # Punkt wejścia aplikacji
├── App.tsx                # Główny komponent
├── tailwind.config.js     # Konfiguracja Tailwind
├── postcss.config.js      # Konfiguracja PostCSS
├── tsconfig.json          # Konfiguracja TypeScript
├── vite.config.ts         # Konfiguracja Vite
├── package.json           # Zależności i skrypty
└── README.md              # Ta dokumentacja
```

## 🌍 Deployment

### Vercel (Rekomendowane)

1. **Zainstaluj Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Ustaw zmienne środowiskowe w Vercel Dashboard**
- Project Settings → Environment Variables
- Dodaj wszystkie zmienne z `.env.example`

### Netlify

1. **Połącz repo z Netlify**
2. **Ustaw build command**: `npm run build`
3. **Ustaw publish directory**: `dist`
4. **Dodaj zmienne środowiskowe** w Site Settings

### GitHub Pages (Opcjonalne)

```bash
# Zbuduj projekt
npm run build

# Deploy na GitHub Pages
npm install -g gh-pages
gh-pages -d dist
```

## 📊 Metryki wydajności

### Lighthouse Score (Target)
- Performance: > 90
- Accessibility: > 95
- Best Practices: 100
- SEO: 100

### Bundle Size
- Total: ~350 KB (gzipped: ~100 KB)
- React vendor: 11.79 KB (gzipped: 4.21 KB)
- Main bundle: 289.74 KB (gzipped: 88.92 KB)
- CSS: 47.50 KB (gzipped: 8.87 KB)

## 🔐 Bezpieczeństwo

### Implemented Security Measures
- ✅ Content Security Policy headers
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Form validation (client & server-ready)
- ✅ Sanitized inputs
- ✅ No exposed API keys

### Security Checklist
- [x] Remove CDN dependencies
- [x] Local dependency bundling
- [x] API keys in environment variables
- [x] Form validation with Zod
- [x] Error boundaries
- [x] Secure headers implementation

## 📝 Changelog

### Version 2.0.0 - 2026-01-09
**Complete Refactoring**

#### 🔒 Security
- Removed exposed API keys from client bundle
- Replaced CDN with local dependencies
- Implemented Content Security Policy
- Added security headers

#### 🏗️ Architecture
- Created proper folder structure
- Added TypeScript types
- Centralized configuration
- Implemented Error Boundary

#### ✨ Features
- Full form validation (React Hook Form + Zod)
- Enhanced accessibility (ARIA, keyboard nav)
- SEO optimization (meta tags, OG, robots.txt)
- Image error handling
- Loading states

#### 🛠️ Developer Experience
- Added ESLint + Prettier
- Created comprehensive README
- Added all necessary config files
- Improved documentation

## 🤝 Contributing

Ten projekt jest prywatny. W przypadku pytań lub sugestii, skontaktuj się z właścicielem.

## 📄 Licencja

© 2026 Karolina Kasztelan Hair & Beauty. All rights reserved.

Prywatne repozytorium - wszelkie prawa zastrzeżone.

## 📧 Kontakt

**Salon Karolina Kasztelan Hair & Beauty**
- 📍 ul. Jerzego Bajana 4, 31-465 Kraków
- 📞 +48 123 456 789
- 📧 kontakt@karolinakasztelan.pl
- 🌐 [Website] (To be deployed)

---

Made with ❤️ for Karolina Kasztelan Hair & Beauty
