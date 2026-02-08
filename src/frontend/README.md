# Sensei Frontend - Welcome Interface

AI-powered life management app for college students. Built with React + TypeScript + Vite for Hacklahoma 2026.

## 🚀 Quick Start

### Prerequisites

**Node.js is required but not yet installed on this system.**

1. **Download and Install Node.js:**
   - Visit: https://nodejs.org/
   - Download the LTS version (v20.x or later recommended)
   - Run the installer
   - Restart your terminal after installation

2. **Verify Installation:**
   ```bash
   node --version    # Should show v20.x or later
   npm --version     # Should show 10.x or later
   ```

### Installation

Once Node.js is installed:

```bash
# Navigate to the frontend directory
cd C:\Users\mouza\dev\hacklahoma-dream-team\src\frontend

# Install all dependencies
npm install

# Start development server
npm run dev
```

The app will automatically open in your browser at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── onboarding/          # Onboarding flow screens
│   │   ├── WelcomeScreen.tsx          ⭐ Main welcome interface
│   │   ├── QuestionScreen.tsx         📋 4-question onboarding
│   │   ├── CompletionScreen.tsx       ✅ Success screen
│   │   └── OnboardingLayout.tsx       📐 Layout wrapper
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── animations/          # Animation components
│       ├── GradientBackground.tsx     🎨 Animated gradient
│       └── FloatingParticles.tsx      ✨ Floating shapes
├── hooks/                   # Custom React hooks
│   ├── useReducedMotion.ts           ♿ Accessibility
│   └── useOnboardingFlow.ts          📊 State management
├── styles/
│   └── index.css                      🎨 Global styles + Tailwind
├── App.tsx                            🏠 Root component & routing
└── main.tsx                           🚪 Entry point
```

## 🎯 Features Implemented

### ✅ Welcome Screen
- Attractive animated gradient background
- Floating particle effects
- Smooth entrance animations (2-3 second sequence)
- "Hi, how can I help you?" message bubble
- Responsive design (mobile-first)
- Accessibility support (respects reduced motion preferences)

### ✅ Onboarding Flow (4 Questions)
1. **Name Input:** "First, what should I call you?"
2. **User Type:** Student / Working Professional / Other
3. **Daily Schedule:** Textarea for typical day description
4. **Challenges:** Multi-select for main struggles
5. **Completion:** Success screen with feature highlights

### ✅ Core Features
- React Router navigation
- Framer Motion animations
- Tailwind CSS styling
- TypeScript for type safety
- Progress indicator
- Keyboard navigation support
- Mobile responsive design

## 🎨 Design System

### Color Palette
- **Primary:** Blue/Purple gradient (trust, wisdom)
- **Accent:** Orange/Coral (energy, motivation)
- **Background:** Clean white/light gray
- **Text:** Deep charcoal

### Animation Timing
- Logo: 0-0.5s (scale + fade with bounce)
- Heading: 0.3-0.8s (slide up + fade)
- Message: 0.6-1.2s (scale from corner)
- Button: 1.0-1.5s (fade + lift)
- Background: 0-2s (gradient shift)

## 🧪 Testing

### Manual Testing Checklist

```bash
# Start dev server
npm run dev
```

**Visual Tests:**
- [ ] Welcome screen loads with gradient background
- [ ] All animations complete smoothly (2-3 seconds)
- [ ] "Get Started" button is visible and clickable
- [ ] Navigation to question 1 works
- [ ] All 4 questions display correctly
- [ ] Progress bar updates with each step
- [ ] Completion screen shows after question 4

**Responsive Tests:**
- [ ] Mobile (375px): Layout looks good
- [ ] Tablet (768px): Layout adjusts properly
- [ ] Desktop (1440px): Content centered nicely

**Accessibility Tests:**
- [ ] Tab navigation highlights buttons
- [ ] Enter key activates buttons
- [ ] Reduced motion mode works (DevTools → Rendering → Emulate CSS prefers-reduced-motion)
- [ ] No console errors

**Performance Tests:**
- [ ] Animations run at 60fps
- [ ] No layout shift during load
- [ ] Page loads in < 1.5s

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔧 Tech Stack

- **Framework:** React 18.3
- **Build Tool:** Vite 6.0
- **Language:** TypeScript 5.6
- **Routing:** React Router DOM 6.28
- **Animation:** Framer Motion 11.15
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React 0.460

## 📱 Browser Support

- Chrome/Edge 120+
- Safari 17+
- Firefox 120+
- Mobile Safari (iOS 16+)
- Chrome Mobile (Android 12+)

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill the process on port 5173
# Then restart: npm run dev
```

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Restart TypeScript server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

## 🚀 Next Steps

After testing the welcome interface:

1. **Backend Integration:**
   - Connect to Firebase for user data storage
   - Save onboarding answers to Firestore
   - Implement authentication flow

2. **Dashboard Implementation:**
   - Daily schedule view
   - Task management
   - AI assistant chat interface
   - Progress tracking

3. **AI Features:**
   - Connect to Cloud AI API
   - Implement chat functionality
   - Smart scheduling algorithms
   - Stress reduction recommendations

4. **Polish:**
   - Add loading states
   - Error handling
   - Toast notifications
   - Dark mode support

## 📝 Notes

- This is the first code implementation for the Sensei project
- Built for Hacklahoma 2026 hackathon
- Target audience: College students (18-25 years old)
- Focus: Time management + Stress reduction + Career pathfinding

## 🤝 Development Tips

- All animations respect `prefers-reduced-motion`
- Minimum touch target size: 44x44px
- Mobile-first responsive design
- WCAG AA color contrast compliance
- Keyboard navigation fully supported

---

**Built with ❤️ for Hacklahoma 2026**
