# Dental Voice AI Website - Modular Architecture

This website uses a modular component-based architecture for easier development and maintenance.

## 🏗️ Project Structure

```
dental-website/
├── src/                     # Source files (what you edit)
│   ├── pages/              # Main page templates (15-20 lines each)
│   │   └── index.html
│   └── components/         # Reusable components
│       ├── layout/         # Page structure
│       │   ├── head.html          (~20 lines)
│       │   ├── header.html        (~40 lines)
│       │   └── footer.html        (~120 lines)
│       ├── heroes/         # Hero sections (page-specific)
│       │   ├── hero-main.html     (~300 lines)
│       │   ├── hero-calendar.html (coming soon)
│       │   └── hero-comparison.html (coming soon)
│       └── sections/       # Content sections (shared)
│           ├── built-for-dentists.html (coming soon)
│           ├── ai-vs-human.html (coming soon)
│           ├── pricing.html (coming soon)
│           └── faq.html (coming soon)
├── dist/                   # Built files (auto-generated, not in repo)
├── archive/                # Original backup files
├── package.json           # Dependencies & scripts
├── gulpfile.js           # Build configuration
└── vercel.json           # Deployment settings
```

## 🚀 Development Workflow

### Initial Setup
```bash
npm install
```

### Development (with live reload)
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
git push origin main  # Auto-deploys via GitHub integration
```

## 📝 How to Edit Components

### 1. Edit Individual Components
- **Header:** Edit `src/components/layout/header.html`
- **Hero:** Edit `src/components/heroes/hero-main.html`
- **Sections:** Edit files in `src/components/sections/`

### 2. Build & Test
```bash
npm run build
```

### 3. View Result
Open `dist/index.html` in browser to see the combined result.

## ✨ Benefits

- **99% smaller files** - Each component is 20-400 lines instead of 2,129 lines
- **Claude-friendly** - Easy to work with individual components
- **Single source of truth** - Edit once, updates everywhere
- **Perfect for Vercel** - Static site generation with SEO benefits

## 🔄 Next Steps

1. Extract remaining sections from original `index.html`
2. Create calendar and comparison hero variants
3. Set up additional pages (calendar.html, comparison.html)
4. Deploy to Vercel with GitHub integration

## 📊 File Size Comparison

| Approach | Main Pages | Component Files | Benefits |
|----------|------------|-----------------|----------|
| **Before** | 2,129 lines each | N/A | ❌ Massive files |
| **After** | 15-20 lines each | 50-400 lines each | ✅ Manageable sizes |
