# 777LIFE 💪

> **A comprehensive fitness tracking Progressive Web App (PWA) for managing meals, workouts, and body progress.**

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![PWA](https://img.shields.io/badge/PWA-enabled-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey.svg)

---

## ✨ Features

### 📱 Progressive Web App
- **Install like a native app** on any device
- **Offline support** - works without internet
- **Push notifications** for reminders
- **Auto-updates** when you deploy changes
- **Home screen icon** for quick access

### 🍽️ Meal Planning
- Daily meal schedules with complete macros
- Multiple diet goals (cut, bulk, recomp, maintain)
- Calorie and protein tracking
- Meal timing optimization
- Customizable meal plans

### 🏋️ Workout Tracking
- 3, 4, and 5-day training splits
- Push/Pull/Legs programs
- Exercise library with sets, reps, and rest periods
- Workout duration tracking (includes shower time!)
- Progress tracking per exercise
- Exercise form videos and guides

### 📊 Progress Monitoring
- **Morning & evening weight logging**
- **Weekly body measurements** (chest, waist, hips, arms, thighs)
- **Body composition tracking** (body fat %, muscle mass)
- **Visual progress charts**
- **Monthly dashboard** with comprehensive stats

### 🧮 Smart Calculators
- TDEE (Total Daily Energy Expenditure) calculator
- Macros calculator based on goals
- BMI and body fat percentage
- Personalized recommendations

### 🎯 Adaptive Engine
- Automatically adjusts plans based on weekly progress
- Tracks adherence and compliance
- Provides weekly performance reports
- Suggests modifications for better results

### 🌍 Multi-Language Support
- English interface
- German language learning section
- Easy to add more languages

---

## 🚀 Quick Start

### For Users (Just Want to Use the App)

1. **Visit the deployed app URL** (get from developer)
2. **Complete the onboarding quiz** (30 seconds)
3. **Install on your phone:**
   - **iPhone:** Safari → Share → Add to Home Screen
   - **Android:** Chrome → Install banner → Install
4. **Enable notifications** when prompted
5. **Start tracking!** 💪

### For Developers (Want to Deploy Your Own)

#### 1. Clone & Install
```bash
git clone <your-repo-url>
cd 777life
npm install
```

#### 2. Test Locally
```bash
npm run dev
# Open http://localhost:5173
```

#### 3. Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts - done in 60 seconds!
```

**Or use the Vercel website:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Click Deploy
4. Done! 🎉

#### 4. Share & Install
- Share your Vercel URL with users
- They install it on their phones
- Everyone gets automatic updates!

---

## 📱 Installation Guide

### iPhone (iOS)

1. Open in **Safari** (must use Safari!)
2. Tap the **Share** button (box with arrow)
3. Scroll down → **"Add to Home Screen"**
4. Tap **"Add"**
5. App appears on home screen! ✅

### Android

1. Open in **Chrome**
2. Tap **"Install"** banner (appears automatically)
   - *Or: Menu (⋮) → "Add to Home screen"*
3. Tap **"Install"**
4. App appears on home screen! ✅

### Desktop (Chrome, Edge)

1. Look for **install icon** in address bar (⊕)
2. Click it
3. Click **"Install"**
4. App opens in its own window! ✅

---

## 🔔 Notifications

### Daily Reminders

- **7:00 AM** - Morning weight check 📊
- **9:00 PM** - Evening weight check 🌙
- **Workout days** - Training reminders 🏋️
- **Weekly** - Progress check-in 📈

### Enable Notifications

1. Open the installed app
2. Banner appears: "Enable Notifications"
3. Tap **"Allow"**
4. Confirm on system prompt
5. Done! ✅

### Manage Notifications

**iPhone:**
`Settings → Notifications → 777LIFE → Toggle On`

**Android:**
`Settings → Apps → 777LIFE → Notifications → Toggle On`

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **Build Tool:** Vite
- **PWA:** vite-plugin-pwa + Workbox
- **Charts:** Recharts
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **UI Components:** Radix UI + Custom Components
- **Notifications:** Web Push API
- **Offline:** Service Workers + Cache API

---

## 📁 Project Structure

```
777life/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── icon-192.png          # App icon (192x192)
│   └── icon-512.png          # App icon (512x512)
├── src/
│   ├── app/
│   │   ├── App.tsx           # Main app component
│   │   └── components/
│   │       ├── PWAHelper.tsx           # PWA install & notifications
│   │       ├── MacrosCalculator.tsx    # TDEE/macros calculator
│   │       ├── MealPlanView.tsx        # Meal planning
│   │       ├── WorkoutTracker.tsx      # Workout tracking
│   │       ├── ProgressTracker.tsx     # Progress monitoring
│   │       ├── MonthlyDashboard.tsx    # Analytics dashboard
│   │       └── ui/                     # Reusable UI components
│   └── styles/
│       ├── index.css         # Global styles
│       ├── tailwind.css      # Tailwind config
│       └── theme.css         # Theme tokens
├── vite.config.ts            # Vite + PWA config
├── package.json
├── PWA_SETUP_GUIDE.md        # Detailed PWA guide
├── QUICK_START.md            # Quick deployment guide
└── README.md                 # This file!
```

---

## 🎨 Customization

### Change App Name

Edit `/public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "YourApp"
}
```

### Change Theme Colors

Edit `/public/manifest.json`:
```json
{
  "theme_color": "#a8e063",
  "background_color": "#111111"
}
```

And update in `/src/app/App.tsx` (CSS section):
```css
--green: #your-primary-color;
--bg: #your-background;
```

### Replace App Icons

Replace these files with your own logo:
- `/public/icon-192.png` (192x192 pixels)
- `/public/icon-512.png` (512x512 pixels)

**Requirements:**
- Square PNG images
- Solid background (no transparency)
- Clear, simple design

### Customize Notifications

Edit `/src/app/components/PWAHelper.tsx`:
```tsx
// Change reminder times
reminder.setHours(7, 0, 0, 0);  // 7 AM
reminder.setHours(21, 0, 0, 0); // 9 PM

// Change messages
body: "Your custom message here"
```

---

## 🔄 Making Updates

### Update & Redeploy

```bash
# 1. Make your changes
# Edit files...

# 2. Commit changes
git add .
git commit -m "Added new feature"
git push

# 3. Vercel auto-deploys (or manually: vercel --prod)
# Users get updates on next app launch!
```

### Update Service Worker

When you make changes, the service worker automatically updates.

To force update immediately:
```tsx
// In PWAHelper.tsx, users can call:
registration.update()
```

---

## 📊 Features Roadmap

### Current Features (v1.0) ✅
- [x] PWA with offline support
- [x] Push notifications
- [x] Meal planning
- [x] Workout tracking
- [x] Progress monitoring
- [x] TDEE/macros calculator
- [x] Body measurements
- [x] Weekly analytics
- [x] Monthly dashboard
- [x] Adaptive training engine
- [x] Multi-goal support

### Coming Soon (v2.0) 🚧
- [ ] Cloud sync (Supabase backend)
- [ ] User accounts & authentication
- [ ] Photo progress tracking
- [ ] Meal prep shopping list generator
- [ ] Exercise form videos
- [ ] Social features (share progress)
- [ ] Apple Health & Google Fit integration
- [ ] Barcode scanner for food logging
- [ ] AI meal suggestions
- [ ] Custom workout builder

---

## 🐛 Troubleshooting

### Install Button Not Showing?

**Checklist:**
- ✅ Using HTTPS? (Vercel/Netlify provide this)
- ✅ Service worker registered? (Check DevTools → Application)
- ✅ Manifest valid? (Check DevTools → Application → Manifest)
- ✅ Using Chrome/Edge? (Safari doesn't show install prompt)

### Notifications Not Working?

1. Check you allowed notifications
2. Verify app is installed (not just opened in browser)
3. Check browser/system settings
4. Try reinstalling the app

### App Not Updating?

1. Close app completely
2. Clear browser cache
3. Reopen app
4. Should auto-update

---

## 📈 Performance

- **Lighthouse Score:** 100/100 PWA
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 2s
- **Offline capable:** ✅
- **Installable:** ✅

---

## 🤝 Contributing

Want to improve 777LIFE?

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with ❤️ using React + Vite
- Icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)
- UI components by [Radix UI](https://www.radix-ui.com)
- Font: [Outfit](https://fonts.google.com/specimen/Outfit)

---

## 📞 Support

Need help? Check out:
- [Quick Start Guide](./QUICK_START.md)
- [PWA Setup Guide](./PWA_SETUP_GUIDE.md)
- [GitHub Issues](https://github.com/yourusername/777life/issues)

---

## 🎯 Start Your Journey Today!

**Deploy → Install → Track → Transform** 💪

[Deploy to Vercel](https://vercel.com/new) | [Deploy to Netlify](https://app.netlify.com/start)

---

Made with 💚 by the 777LIFE team
