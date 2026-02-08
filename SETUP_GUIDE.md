# 🚀 Sensei Project Setup Guide

**For Hacklahoma 2026 Dream Team**

This guide will help you set up the Sensei project on your local machine for development.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

#### 1. Git
- **Check if installed:** `git --version`
- **Download:** https://git-scm.com/downloads
- **Recommended version:** 2.40+

#### 2. Node.js & npm
- **Check if installed:** `node --version` and `npm --version`
- **Required:** Node.js v20.x or later
- **Download:** https://nodejs.org/ (LTS version recommended)

---

## 🔧 Node.js Installation

### Option A: Manual Installation (All Platforms)

1. **Visit Node.js Website:**
   - Go to: https://nodejs.org/
   - Download the **LTS (Long Term Support)** version

2. **Run the Installer:**
   - Windows: Run the `.msi` installer
   - Mac: Run the `.pkg` installer
   - Linux: Use your package manager (see below)

3. **Verify Installation:**
   ```bash
   node --version    # Should show v20.x or later
   npm --version     # Should show 10.x or later
   ```

4. **Restart Your Terminal**
   - Close and reopen your terminal/command prompt
   - This ensures the PATH is updated

### Option B: Windows Package Manager (Windows Only)

If you have Windows 10/11 with winget:

```bash
# Check if winget is available
winget --version

# Install Node.js LTS
winget install --id OpenJS.NodeJS.LTS --silent
```

### Option C: Package Managers (Mac/Linux)

**macOS (using Homebrew):**
```bash
# Install Homebrew first if not installed: https://brew.sh
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Linux (Fedora):**
```bash
sudo dnf install nodejs
```

---

## 📦 Project Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/DallasElleman/hacklahoma-dream-team.git

# Navigate to project directory
cd hacklahoma-dream-team

# Switch to the development branch
git checkout volume1
```

### Step 2: Install Frontend Dependencies

```bash
# Navigate to the frontend directory
cd src/frontend

# Install all dependencies
npm install
```

**Expected output:**
```
added 247 packages in 21s
found 0 vulnerabilities
```

This will install:
- React & React DOM
- React Router DOM
- Framer Motion (animations)
- Tailwind CSS (styling)
- Vite (build tool)
- TypeScript
- All development dependencies

### Step 3: Verify Installation

```bash
# Check that node_modules directory exists
ls node_modules   # or 'dir node_modules' on Windows

# Verify package.json dependencies
npm list --depth=0
```

---

## 🚀 Running the Development Server

### Start the Dev Server

```bash
# Make sure you're in src/frontend directory
cd src/frontend

# Start Vite development server
npm run dev
```

**Expected output:**
```
VITE v6.4.1  ready in 2129 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Open in Browser

1. Open your browser
2. Navigate to: **http://localhost:5173**
3. You should see the Sensei welcome screen with animations

### Stop the Dev Server

Press `Ctrl + C` in the terminal running the dev server

---

## 🎯 What You Should See

After starting the dev server, you should see:

### Welcome Screen
- ✅ Animated gradient background (blue → purple → orange)
- ✅ Floating white particles moving gently
- ✅ Logo animation with bounce effect
- ✅ "Welcome to Sensei" heading
- ✅ Message bubble: "Hi, how can I help you?"
- ✅ "Get Started" button

### Onboarding Flow
- ✅ Progress bar at the top
- ✅ 4 questions with smooth transitions
- ✅ Back button navigation
- ✅ Success screen after completion

---

## 🧪 Testing Checklist

### Visual Tests
- [ ] Gradient background animates smoothly
- [ ] All text is readable
- [ ] Buttons have hover effects
- [ ] Animations complete in 2-3 seconds
- [ ] No layout shift during load

### Functional Tests
- [ ] "Get Started" button navigates to Question 1
- [ ] Can answer all 4 questions
- [ ] Progress bar updates (25%, 50%, 75%, 100%)
- [ ] Back button works
- [ ] Completion screen displays after Question 4

### Responsive Tests (DevTools → Device Toolbar)
- [ ] Mobile (375px): iPhone SE
- [ ] Mobile (390px): iPhone 12 Pro
- [ ] Tablet (768px): iPad
- [ ] Desktop (1440px): Full width

### Accessibility Tests
- [ ] Tab key navigates through buttons
- [ ] Enter key activates buttons
- [ ] DevTools → Rendering → "Emulate CSS prefers-reduced-motion"
  - Animations should be minimal/instant

### Browser Tests
- [ ] Chrome/Edge (primary)
- [ ] Safari (Mac/iOS)
- [ ] Firefox

---

## 🐛 Troubleshooting

### Issue: `node: command not found`

**Cause:** Node.js is not installed or not in PATH

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart your terminal
3. Verify: `node --version`

---

### Issue: `npm install` fails

**Cause:** Network issues or npm cache corruption

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install

# If still failing, delete node_modules and try again
rm -rf node_modules package-lock.json  # or rmdir /s node_modules on Windows
npm install
```

---

### Issue: Port 5173 already in use

**Cause:** Another process is using port 5173

**Solution:**
- Vite will automatically try ports 5174, 5175, etc.
- Or manually specify a port:
```bash
npm run dev -- --port 3000
```

---

### Issue: TypeScript errors in editor

**Cause:** TypeScript server needs restart or dependencies not installed

**Solution:**
1. Ensure `npm install` completed successfully
2. VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
3. Reload VS Code window

---

### Issue: Hot Module Replacement (HMR) not working

**Cause:** File watchers limit reached (Linux) or antivirus blocking

**Solution:**

**Linux:**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**Windows:** Add `src/frontend` to antivirus exclusions

---

### Issue: Blank white screen

**Cause:** JavaScript error or routing issue

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify you're on http://localhost:5173 (not https)

---

### Issue: Animations not smooth

**Cause:** Performance issue or browser GPU acceleration disabled

**Solution:**
1. Close other browser tabs
2. Check browser GPU acceleration is enabled
3. Update graphics drivers
4. Try Chrome/Edge (better performance than Firefox for animations)

---

## 📁 Project Structure

```
hacklahoma-dream-team/
├── src/
│   └── frontend/                    # React application
│       ├── src/
│       │   ├── components/
│       │   │   ├── onboarding/      # Welcome & onboarding screens
│       │   │   ├── ui/              # Reusable UI components
│       │   │   └── animations/      # Animation components
│       │   ├── hooks/               # Custom React hooks
│       │   ├── styles/              # Global CSS
│       │   ├── App.tsx              # Root component
│       │   └── main.tsx             # Entry point
│       ├── package.json             # Dependencies
│       ├── vite.config.ts          # Vite configuration
│       ├── tailwind.config.js      # Tailwind design system
│       └── README.md               # Detailed documentation
├── docs/                            # Planning documents
└── README.md                        # Project overview
```

---

## 🛠️ Available npm Scripts

```bash
npm run dev      # Start development server (hot reload)
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint to check code quality
```

---

## 🎨 Tech Stack Overview

### Frontend Framework
- **React 18.3** - UI library
- **TypeScript 5.6** - Type safety
- **Vite 6.0** - Build tool (fast!)

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **Custom design system** - Colors, animations, spacing

### Routing & Animation
- **React Router DOM 6.28** - Navigation
- **Framer Motion 11.15** - Declarative animations

### Icons & UI
- **Lucide React 0.460** - Icon library
- **Custom components** - Button, Card, Layout

---

## 👥 Team Development Workflow

### Daily Development

1. **Pull latest changes:**
   ```bash
   git checkout volume1
   git pull origin volume1
   ```

2. **Install any new dependencies:**
   ```bash
   npm install
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

4. **Make changes and test:**
   - Edit files in `src/`
   - Changes auto-reload in browser
   - Check browser console for errors

5. **Commit your work:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin volume1
   ```

### Code Quality

Before committing, ensure:
- [ ] No console errors
- [ ] Code follows TypeScript types
- [ ] Components are responsive
- [ ] Animations are smooth
- [ ] Run `npm run lint` to check for issues

---

## 🔐 Environment Variables

Currently, no environment variables are required for the frontend.

When we add Firebase integration, you'll need to create a `.env` file:

```bash
# .env (in src/frontend/)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
```

**Note:** Never commit `.env` to git (it's already in `.gitignore`)

---

## 📚 Additional Resources

### Documentation
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion/
- **Vite:** https://vitejs.dev/guide/

### Project-Specific Docs
- **Frontend README:** `src/frontend/README.md`
- **Quick Start Guide:** `src/frontend/QUICK_START.md`
- **Implementation Summary:** `src/frontend/IMPLEMENTATION_SUMMARY.md`

### Team Communication
- **GitHub Issues:** Report bugs and feature requests
- **Pull Requests:** Submit code for review
- **Discord/Slack:** Real-time communication (if applicable)

---

## 🎓 For New Team Members

### First Time Setup (Complete Walkthrough)

1. **Install Git:**
   - Download from https://git-scm.com/downloads
   - Verify: `git --version`

2. **Install Node.js:**
   - Download LTS from https://nodejs.org/
   - Verify: `node --version` (should be v20+)

3. **Clone Repository:**
   ```bash
   git clone https://github.com/DallasElleman/hacklahoma-dream-team.git
   cd hacklahoma-dream-team
   git checkout volume1
   ```

4. **Install Dependencies:**
   ```bash
   cd src/frontend
   npm install
   ```

5. **Start Development:**
   ```bash
   npm run dev
   ```

6. **Open in Browser:**
   - Navigate to http://localhost:5173
   - You should see the welcome screen

7. **Start Coding:**
   - Explore the codebase in `src/frontend/src/`
   - Make a test change to see hot reload
   - Check the component structure

### Learning Path

1. **Week 1:** Understand the welcome interface
   - Read `WelcomeScreen.tsx`
   - Understand animation patterns
   - Learn Tailwind utility classes

2. **Week 2:** Build a new component
   - Create a simple card component
   - Add it to the dashboard placeholder
   - Practice with Framer Motion

3. **Week 3:** Implement a feature
   - Add a new onboarding question
   - Integrate with state management
   - Write tests

---

## ✅ Setup Complete!

Once you've successfully:
- ✅ Installed Node.js
- ✅ Cloned the repository
- ✅ Installed dependencies
- ✅ Started the dev server
- ✅ Seen the welcome screen in your browser

**You're ready to develop! 🎉**

---

## 🆘 Need Help?

If you encounter issues not covered in this guide:

1. **Check existing documentation:**
   - `src/frontend/README.md`
   - `src/frontend/QUICK_START.md`

2. **Search GitHub Issues:**
   - https://github.com/DallasElleman/hacklahoma-dream-team/issues

3. **Ask the Team:**
   - Create a new GitHub Issue
   - Tag with `help-wanted` label
   - Provide error messages and screenshots

4. **Common Fixes:**
   - Restart terminal
   - Delete `node_modules` and reinstall
   - Clear browser cache
   - Update Node.js to latest LTS

---

**Last Updated:** 2026-02-07
**For:** Hacklahoma 2026 Dream Team
**Project:** Sensei - AI-Powered Life Management App

---

**Happy Coding! 🚀**
