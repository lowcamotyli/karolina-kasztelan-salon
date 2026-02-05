# 🚀 Deployment Guide

Instrukcje wdrożenia strony Karolina Kasztelan Salon na różne platformy.

## 📋 Spis treści
1. [Vercel (Rekomendowane)](#vercel-deployment)
2. [Netlify](#netlify-deployment)
3. [GitHub Pages](#github-pages-deployment)
4. [Własny serwer (VPS)](#vps-deployment)

---

## 🟢 Vercel Deployment (Rekomendowane)

Vercel oferuje najszybszy i najłatwiejszy deployment dla projektów React + Vite.

### Krok 1: Przygotowanie

1. Utwórz konto na [vercel.com](https://vercel.com)
2. Połącz konto GitHub z Vercel

### Krok 2: Import projektu

1. Zaloguj się do Vercel Dashboard
2. Kliknij **"Add New"** → **"Project"**
3. Wybierz **"Import Git Repository"**
4. Znajdź i wybierz `karolina-kasztelan-salon`
5. Kliknij **"Import"**

### Krok 3: Konfiguracja

**Framework Preset**: Vite (wykryty automatycznie)

**Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Environment Variables:**
```
VITE_CONTACT_PHONE="+48 123 456 789"
VITE_CONTACT_EMAIL="kontakt@karolinakasztelan.pl"
VITE_CONTACT_ADDRESS="ul. Jerzego Bajana 4"
VITE_CONTACT_CITY="31-465 Kraków"
```

### Krok 4: Deploy

1. Kliknij **"Deploy"**
2. Poczekaj 1-2 minuty
3. Twoja strona jest live! 🎉

### Krok 5: Custom Domain (Opcjonalnie)

1. W Project Settings → **"Domains"**
2. Dodaj własną domenę (np. `karolinakasztelan.pl`)
3. Skonfiguruj DNS u swojego dostawcy domeny:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Auto-deployment

✅ Każdy push do `master` branch automatycznie wdraża nową wersję!

---

## 🔵 Netlify Deployment

### Metoda 1: Przez interfejs (UI)

1. Zaloguj się na [netlify.com](https://netlify.com)
2. **"Add new site"** → **"Import an existing project"**
3. Wybierz **"GitHub"** i autoryzuj
4. Wybierz `karolina-kasztelan-salon`
5. **Konfiguracja budowania:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```
6. **Environment Variables** (Site settings → Build & deploy):
   ```
   VITE_CONTACT_PHONE="+48 123 456 789"
   VITE_CONTACT_EMAIL="kontakt@karolinakasztelan.pl"
   VITE_CONTACT_ADDRESS="ul. Jerzego Bajana 4"
   VITE_CONTACT_CITY="31-465 Kraków"
   ```
7. Kliknij **"Deploy site"**

### Metoda 2: Przez CLI

```bash
# Zainstaluj Netlify CLI
npm install -g netlify-cli

# Zaloguj się
netlify login

# Zbuduj projekt
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Custom Domain

1. Site settings → **"Domain management"**
2. Dodaj custom domain
3. Skonfiguruj DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: [your-site-name].netlify.app
   ```

---

## 🟣 GitHub Pages Deployment

### Krok 1: Konfiguracja

Dodaj do `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/karolina-kasztelan-salon/', // nazwa twojego repo
  // ... reszta konfiguracji
})
```

### Krok 2: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Krok 3: Dodaj skrypt do package.json

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Krok 4: Deploy

```bash
npm run deploy
```

### Krok 5: Włącz GitHub Pages

1. Idź do Settings repo na GitHub
2. **"Pages"** w menu bocznym
3. Source: **"gh-pages"** branch
4. Kliknij **"Save"**

Strona będzie dostępna pod:
`https://jinsak8.github.io/karolina-kasztelan-salon/`

### ⚠️ Uwaga

GitHub Pages **nie obsługuje** zmiennych środowiskowych, więc nie nadaje się jeśli potrzebujesz `.env` variables.

---

## 🟠 VPS Deployment (Advanced)

### Wymagania

- Serwer VPS (Ubuntu 20.04+)
- Domena skonfigurowana z DNS
- Dostęp SSH

### Krok 1: Przygotowanie serwera

```bash
# Połącz się z serwerem
ssh user@your-server-ip

# Zainstaluj Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Zainstaluj nginx
sudo apt-get install nginx

# Zainstaluj certbot (SSL)
sudo apt-get install certbot python3-certbot-nginx
```

### Krok 2: Sklonuj projekt

```bash
cd /var/www
sudo git clone https://github.com/JinSakai8/karolina-kasztelan-salon.git
cd karolina-kasztelan-salon
```

### Krok 3: Budowanie

```bash
# Utwórz .env.local
sudo nano .env.local
# Wklej zmienne środowiskowe

# Zainstaluj zależności
sudo npm install

# Zbuduj projekt
sudo npm run build
```

### Krok 4: Konfiguracja Nginx

```bash
sudo nano /etc/nginx/sites-available/karolina-kasztelan
```

Wklej:
```nginx
server {
    listen 80;
    server_name karolinakasztelan.pl www.karolinakasztelan.pl;

    root /var/www/karolina-kasztelan-salon/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Krok 5: Aktywuj konfigurację

```bash
sudo ln -s /etc/nginx/sites-available/karolina-kasztelan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Krok 6: SSL (HTTPS)

```bash
sudo certbot --nginx -d karolinakasztelan.pl -d www.karolinakasztelan.pl
```

### Krok 7: Auto-renewal SSL

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatycznie dodaje cron job
```

### Update procedure

```bash
cd /var/www/karolina-kasztelan-salon
sudo git pull origin master
sudo npm install
sudo npm run build
```

---

## 🔒 Security Checklist przed deploymentem

- [ ] Zmienne środowiskowe ustawione na platformie
- [ ] `.env.local` dodane do `.gitignore`
- [ ] SSL/HTTPS włączony
- [ ] CSP headers skonfigurowane
- [ ] Build produkcyjny przetestowany lokalnie (`npm run preview`)
- [ ] Wszystkie obrazy zoptymalizowane
- [ ] Lighthouse score sprawdzony (>90)

---

## 📊 Performance Optimization

### Po deploymencie sprawdź:

1. **Lighthouse Audit**
   - Otwórz DevTools → Lighthouse
   - Run audit dla Mobile i Desktop
   - Target: Performance >90, Accessibility >95

2. **WebPageTest.org**
   - Test z różnych lokalizacji
   - Sprawdź Time to First Byte (TTFB)

3. **GTmetrix**
   - Analiza Core Web Vitals
   - Largest Contentful Paint (LCP) < 2.5s
   - First Input Delay (FID) < 100ms
   - Cumulative Layout Shift (CLS) < 0.1

---

## 🎯 Post-Deployment Checklist

- [ ] Strona dostępna pod głównym URL
- [ ] WWW redirect działa
- [ ] HTTPS aktywny
- [ ] Formularz rezerwacji działa
- [ ] Wszystkie obrazy się ładują
- [ ] Google Maps wyświetla się
- [ ] Mobile menu działa
- [ ] SEO meta tags obecne (View Source)
- [ ] Google Analytics podłączony (opcjonalnie)
- [ ] Google Search Console zweryfikowany (opcjonalnie)

---

## 🆘 Troubleshooting

### Problem: Strona pokazuje 404

**Rozwiązanie**: Upewnij się, że output directory to `dist` i że build się udał.

### Problem: Zmienne środowiskowe nie działają

**Rozwiązanie**: 
- Sprawdź prefix `VITE_` (wymagany!)
- Restart dev server po dodaniu `.env`
- Na platformie (Vercel/Netlify) dodaj przez UI

### Problem: Białe tło zamiast strony

**Rozwiązanie**: Sprawdź console błędy (F12), prawdopodobnie błąd w JavaScript

### Problem: CSS nie działa

**Rozwiązanie**: 
- Sprawdź czy `index.css` jest zaimportowany
- Sprawdź Tailwind config paths

---

## 📞 Wsparcie

Jeśli potrzebujesz pomocy z deploymentem, skontaktuj się z developerem projektu.

---

Made with ❤️ for Karolina Kasztelan Hair & Beauty
