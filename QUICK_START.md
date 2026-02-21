# 🚀 777LIFE - Quick Start Guide

## Get Your App Running in 5 Minutes! ⏱️

### Step 1: Test Locally (Optional)

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Open in browser
# Go to: http://localhost:5173
```

### Step 2: Deploy to Vercel (Easiest!) 🎯

#### Option A: From Browser (No Terminal!)

1. **Go to [vercel.com](https://vercel.com/new)**

2. **Sign in with GitHub**

3. **Import this repository**
   - Click "Import Git Repository"
   - Select your repo
   - Click "Import"

4. **Deploy!**
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click "Deploy"

5. **Done!** 🎉
   - You'll get a URL like: `https://777life.vercel.app`
   - Open on your phone and install!

#### Option B: From Terminal (Fast!)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy!
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - What's your project's name? 777life
# - In which directory is your code located? ./
# - Want to override the settings? N

# Your app is live! 🚀
```

### Step 3: Install on Your Phone 📱

#### iPhone (Safari)

1. Open the Vercel URL in **Safari**
2. Tap the **Share** button (↑)
3. Scroll down → **"Add to Home Screen"**
4. Tap **"Add"**
5. Done! Open from home screen 🎉

#### Android (Chrome)

1. Open the Vercel URL in **Chrome**
2. Tap **"Install"** banner when it appears
   - OR: Menu (⋮) → "Add to Home screen"
3. Tap **"Install"**
4. Done! Open from home screen 🎉

### Step 4: Enable Notifications 🔔

1. **Open the installed app**
2. **Tap "Allow" on the notification banner**
3. **Confirm on the system prompt**

You'll now get:
- 📅 7 AM - Morning weight reminder
- 📅 9 PM - Evening weight reminder
- 🏋️ Workout reminders
- 📊 Weekly progress check-ins

---

## 🎯 That's It!

Your app is now:
✅ Deployed online
✅ Installed on your phone
✅ Sending you notifications
✅ Working offline

---

## 🔄 Making Updates

### Update Your App

1. **Make changes to your code**
2. **Push to GitHub**
3. **Vercel auto-deploys** (takes ~1 minute)
4. **Users auto-update** on next app launch

```bash
# Make changes, then:
git add .
git commit -m "Updated features"
git push

# Vercel will automatically deploy!
```

---

## 📊 Other Deployment Options

### Netlify (Also Free!)

1. **Go to [netlify.com](https://app.netlify.com)**
2. **Drag & drop your project folder**
3. **Done!** Get a URL instantly

### GitHub Pages

```bash
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

---

## 🎨 Customize Your App

### Change App Name

Edit `/public/manifest.json`:
```json
{
  "name": "My Fitness App",
  "short_name": "MyFit"
}
```

### Change App Icon

Replace these files:
- `/public/icon-192.png`
- `/public/icon-512.png`

Use your own logo (192x192 and 512x512 pixels, PNG format)

### Change Colors

Edit `/public/manifest.json`:
```json
{
  "theme_color": "#your-color",
  "background_color": "#your-bg"
}
```

---

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel/Netlify
- [ ] Tested deployment URL
- [ ] Installed on phone
- [ ] Notifications enabled
- [ ] App working offline

---

## 🆘 Troubleshooting

### App Won't Install?
- Make sure you're using HTTPS (Vercel/Netlify provide this)
- Try clearing browser cache
- Use Chrome on Android or Safari on iPhone

### Notifications Not Working?
- Check app settings on your phone
- Make sure you clicked "Allow" when prompted
- Reinstall the app if needed

### Build Failing?
- Check `package.json` has all dependencies
- Run `npm install` to update packages
- Check the Vercel/Netlify build logs

---

## 💡 Pro Tips

1. **Share with friends:** Just send them your Vercel URL
2. **Test updates:** Use `npm run preview` to test builds locally
3. **Monitor deploys:** Check Vercel dashboard for deployment status
4. **Custom domain:** Add your own domain in Vercel settings (free!)

---

## 🎉 You're All Set!

Your 777LIFE app is now:
- 📱 Installed like a real app
- 🔔 Sending notifications
- ⚡ Lightning fast
- 💾 Working offline
- 🚀 Auto-updating

**Start tracking your fitness journey! 💪**

---

## 📚 Learn More

- [Full PWA Setup Guide](./PWA_SETUP_GUIDE.md)
- [Vercel Documentation](https://vercel.com/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
