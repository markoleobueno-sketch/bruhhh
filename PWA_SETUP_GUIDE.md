# 777LIFE PWA Setup Guide 📱

Your fitness app is now a **Progressive Web App (PWA)**! This means it can be installed on your phone like a native app with notifications, offline support, and more.

## 🎯 What You Get

### ✅ Install as Real App
- Add to home screen on iPhone/Android
- Works like a native app (no browser UI)
- Launch from your home screen
- Full-screen experience

### 🔔 Push Notifications
- **Morning reminder** (7 AM) - "Log your weight 💪"
- **Evening reminder** (9 PM) - "Time to log your evening weight 🌙"
- Workout reminders
- Custom notifications

### 💾 Offline Support
- Works without internet
- All data cached locally
- Service worker caching

### ⚡ Fast Performance
- Cached resources
- Instant loading
- Smooth animations

---

## 📲 How to Install on Your Phone

### iPhone (iOS/Safari)

1. **Open in Safari** (must use Safari, not Chrome)
   - Go to your deployed app URL
   
2. **Tap the Share button** (square with arrow pointing up)
   - Located at the bottom of the screen
   
3. **Scroll down and tap "Add to Home Screen"**
   - You'll see the 777LIFE icon and name
   
4. **Tap "Add"**
   - App icon appears on your home screen!

5. **Open the app from your home screen**
   - It will run in full-screen mode

### Android (Chrome)

1. **Open in Chrome**
   - Go to your deployed app URL
   
2. **You'll see an install banner automatically**
   - Tap "Install" when prompted
   
   OR manually:
   
3. **Tap the menu (3 dots)**
   - Top right corner
   
4. **Tap "Add to Home screen"** or "Install app"
   
5. **Tap "Add" or "Install"**
   - App icon appears on your home screen!

---

## 🔔 Enable Notifications

### First Time Setup

1. **Open the installed app**
   
2. **Allow notifications banner will appear**
   - Tap "Allow" to enable
   
3. **Your device will ask for permission**
   - Tap "Allow" again

### What You'll Get

- 📅 **7:00 AM** - Morning weight reminder
- 📅 **9:00 PM** - Evening weight reminder
- 🏋️ **Workout days** - Training reminders
- 📊 **Weekly** - Progress check-in

### Manage Notifications

**iPhone:**
- Settings → Notifications → 777LIFE → Allow Notifications

**Android:**
- Settings → Apps → 777LIFE → Notifications → Toggle on

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

1. **Push your code to GitHub**

2. **Go to [vercel.com](https://vercel.com)**
   - Sign in with GitHub

3. **Import your repository**
   - Click "New Project"
   - Select your repo
   - Click "Deploy"

4. **Done!** 
   - You'll get a URL like: `https://777life.vercel.app`
   - Share this with your phone

### Option 2: Netlify (Free & Easy)

1. **Push your code to GitHub**

2. **Go to [netlify.com](https://netlify.com)**
   - Sign in with GitHub

3. **Add new site from Git**
   - Connect to GitHub
   - Select your repo
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Deploy!**
   - You'll get a URL like: `https://777life.netlify.app`

### Option 3: GitHub Pages (Free)

1. **Add to package.json:**
   ```json
   "homepage": "https://[your-username].github.io/777life",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

---

## 🛠️ Customization

### Change App Icon

Replace these files in `/public/`:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

**Requirements:**
- Square images
- PNG format
- Solid background (no transparency for best results)
- Use your logo or custom design

### Change App Name

Edit `/public/manifest.json`:
```json
{
  "name": "Your Custom Name",
  "short_name": "YourApp"
}
```

### Change Theme Color

Edit `/public/manifest.json`:
```json
{
  "theme_color": "#your-color",
  "background_color": "#your-bg-color"
}
```

### Customize Notifications

Edit `/src/app/components/PWAHelper.tsx`:
- Change reminder times (currently 7 AM & 9 PM)
- Modify notification messages
- Add custom reminders

---

## 🧪 Testing

### Test on Desktop

1. **Chrome DevTools**
   - Open DevTools (F12)
   - Go to "Application" tab
   - Check "Service Workers" section
   - Check "Manifest" section

2. **Lighthouse Audit**
   - DevTools → Lighthouse tab
   - Run PWA audit
   - Should score 100/100

### Test Install Prompt

1. Open in Chrome/Edge
2. Look for install icon in address bar
3. Click to install

### Test Notifications

1. Install the app
2. Allow notifications
3. Check console for scheduled reminders

---

## 📊 Features Included

### ✅ Complete PWA Setup
- [x] Web App Manifest
- [x] Service Worker
- [x] Offline caching
- [x] Install prompts
- [x] Push notifications
- [x] Home screen icons

### 🔔 Notification Types
- [x] Daily weight reminders (2x/day)
- [x] Workout reminders
- [x] Progress check-ins
- [ ] Meal reminders (coming soon)
- [ ] Custom reminders (coming soon)

### 💾 Offline Features
- [x] App shell caching
- [x] Google Fonts caching
- [x] Static assets caching
- [x] Runtime caching

---

## 🐛 Troubleshooting

### Install Button Not Showing?

**Checklist:**
- ✅ Using HTTPS (required for PWA)
- ✅ Service worker registered
- ✅ Manifest file valid
- ✅ Using Chrome/Edge (Safari doesn't show install prompt)

### Notifications Not Working?

**Check:**
1. Did you allow notifications?
2. Is the app installed?
3. Check browser settings
4. Check device settings

**iPhone:** System Settings → Notifications → 777LIFE

**Android:** Settings → Apps → 777LIFE → Notifications

### App Not Installing?

**Try:**
1. Clear browser cache
2. Use incognito mode
3. Check HTTPS is enabled
4. Verify manifest.json is loading

---

## 📱 Best Practices

### For Users

1. **Install the app** for best experience
2. **Allow notifications** to stay on track
3. **Add to home screen** for quick access
4. **Keep app updated** (auto-updates!)

### For Developers

1. **Test on real devices** before sharing
2. **Use HTTPS** (required for PWA features)
3. **Update service worker** when making changes
4. **Monitor cache sizes** to avoid bloat

---

## 🎉 Next Steps

1. ✅ **Deploy your app** (Vercel/Netlify recommended)
2. ✅ **Install on your phone**
3. ✅ **Enable notifications**
4. ✅ **Start using 777LIFE!**

---

## 💡 Pro Tips

- **Share with friends:** Send them your app URL
- **Offline mode:** Works even without internet
- **Updates:** App auto-updates when you deploy changes
- **Home screen:** Feels like a real app!

---

## 🆘 Need Help?

### Common Issues

**Q: Can I use this on iPhone?**
A: Yes! Use Safari's "Add to Home Screen" feature.

**Q: Does it work offline?**
A: Yes! The service worker caches everything you need.

**Q: How do I update the app?**
A: Just deploy your changes. Users will auto-update on next launch.

**Q: Can I change the icon?**
A: Yes! Replace `/public/icon-192.png` and `/public/icon-512.png`

---

## 🎯 Ready to Deploy!

Your app is now a fully functional PWA! 🚀

1. Choose a deployment platform (Vercel recommended)
2. Deploy your code
3. Open the URL on your phone
4. Install & enjoy!

**Happy tracking! 💪📱**
