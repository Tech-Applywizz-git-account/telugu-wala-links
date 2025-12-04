# Telugu Wala Links - Frontend Application

A complete React.js job portal application for connecting Telugu professionals with US visa-sponsored opportunities.

## 🚀 Features

- **Homepage** with hero section, features, how-it-works, and testimonials
- **Pricing Page** with $30/month subscription model
- **Login** with magic link authentication UI
- **Signup Flow** (2 steps: email capture → pre-checkout)
- **Job Search** with advanced filters (visa type, location, education, experience)
- **User Dashboard** with 6 tabs (search, saved jobs, applied jobs, profile, settings, billing)

## 🎨 Design

- **Brand Colors**: Telugu Wala Links yellow (#FDB913) with dark accents
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean layouts with smooth transitions and hover effects
- **Icons**: Lucide React icons throughout

## 📦 Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Build Tool**: Vite (Rolldown)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173/`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx     # Navigation with mobile menu
│   │   ├── Footer.jsx     # Footer with links
│   │   ├── HeroSection.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── HowItWorks.jsx
│   │   └── Testimonials.jsx
│   ├── pages/             # Page components
│   │   ├── Homepage.jsx   # Landing page
│   │   ├── Pricing.jsx    # Pricing page
│   │   ├── Login.jsx      # Login page
│   │   ├── Signup.jsx     # Signup flow
│   │   ├── JobSearch.jsx  # Job search & results
│   │   └── Dashboard.jsx  # User dashboard
│   ├── App.jsx           # Main app with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles + Tailwind
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
└── package.json
```

## 🎯 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Homepage | Landing page with hero, features, testimonials |
| `/pricing` | Pricing | Pricing information and FAQ |
| `/login` | Login | Email-based authentication |
| `/signup` | Signup | Two-step signup process |
| `/jobs` | JobSearch | Job listings with filters |
| `/dashboard` | Dashboard | User dashboard with 6 tabs |

## 🎨 Color Palette

```css
--primary-yellow: #FDB913   /* Telugu Wala Links signature */
--primary-dark: #1A1A1A     /* Text and backgrounds */
--accent-blue: #0066CC      /* Links and CTAs */
--accent-green: #10B981     /* Success states */
--accent-orange: #F97316    /* Highlights */

/* Visa Type Colors */
--visa-h1b: #3B82F6        /* Blue */
--visa-opt: #8B5CF6        /* Purple */
--visa-greencard: #10B981  /* Green */
--visa-tn: #F59E0B         /* Amber */
--visa-e3: #EC4899         /* Pink */
--visa-j1: #06B6D4         /* Cyan */
```

## 🔧 Troubleshooting

### Dev server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Tailwind styles not applying
```bash
# Ensure Tailwind is properly configured
npm install -D tailwindcss postcss autoprefixer
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📖 Related Documentation

- **PRD**: See `prd_telugu_wala_links.md` for complete product requirements

---

**Built with ❤️ for the Telugu community**
