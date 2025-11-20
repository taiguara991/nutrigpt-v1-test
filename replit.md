# NutriGPT - Personalized Nutrition App

## Overview
NutriGPT is a React-based web application that provides personalized nutrition plans and workout recommendations using Google's Gemini AI. The app is designed for Brazilian Portuguese users and creates customized meal plans, shopping lists, and exercise routines based on user profiles.

**Current State:** Fully configured and running on Replit with all dependencies installed and workflows set up.

## Recent Changes (November 20, 2025)
- Configured project for Replit environment
- Updated Vite config to use port 5000 and allowedHosts for webview compatibility
- Fixed index.html to properly load app using Vite's module system (removed external CDN import maps)
- Configured GEMINI_API_KEY secret for AI functionality
- **Added Supabase integration** for cloud database storage
- Installed @supabase/supabase-js package
- Created database service layer (databaseService.ts) for profiles and daily plans
- Configured SUPABASE_URL and SUPABASE_ANON_KEY secrets
- Set up deployment configuration for static site deployment
- Created workflow for development server

## Project Architecture

### Tech Stack
- **Frontend Framework:** React 19.2.0 with TypeScript
- **Build Tool:** Vite 6.4.1
- **Styling:** Tailwind CSS (loaded via CDN - no build plugin configured)
- **AI Service:** Google Gemini 2.5 Flash (via @google/genai 1.30.0)
- **Database:** Supabase PostgreSQL (via @supabase/supabase-js 2.x)
- **State Management:** React useState with localStorage + Supabase sync

### Project Structure
```
/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Button, Toast)
│   ├── ChatTab.tsx      # Chat interface with AI nutritionist
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── ExerciseCard.tsx # Exercise display component
│   ├── Icons.tsx        # SVG icon components
│   ├── MealCard.tsx     # Meal plan display component
│   ├── Onboarding.tsx   # User profile creation flow
│   ├── ProgressTab.tsx  # Progress tracking view
│   └── ShoppingList.tsx # Shopping list component
├── services/
│   ├── geminiService.ts    # Google Gemini AI integration
│   ├── supabaseClient.ts   # Supabase client configuration
│   └── databaseService.ts  # Database CRUD operations
├── App.tsx              # Main app component
├── index.tsx            # React entry point
├── types.ts             # TypeScript type definitions
├── vite.config.ts       # Vite configuration
└── index.html           # HTML entry point
```

### Key Features
1. **User Onboarding:** Collects age, gender, height, weight, goals, activity level, region, and dietary restrictions
2. **Daily Plan Generation:** AI-generated meal plans with:
   - 4 meals per day (breakfast, lunch, snack, dinner)
   - Calorie and macro tracking
   - Preparation times and ingredients
   - Consolidated shopping list
   - Workout recommendations
3. **Chat Interface:** Ask questions to an AI nutritionist
4. **Progress Tracking:** View historical plans and track progress
5. **Shopping List:** Organized ingredients for the day's meals

### Data Storage
**Hybrid Storage Strategy:**
- **localStorage:** Primary storage for quick access and offline functionality
  - User profile (`nutrigpt_profile`)
  - Daily plans (`nutrigpt_daily_plan`)
  - Plan dates (`nutrigpt_plan_date`)
  - User ID (`nutrigpt_user_id`)

- **Supabase (Cloud Database):** Backup and sync storage
  - `profiles` table: User profiles with full metadata
  - `daily_plans` table: Historical meal plans and workouts
  - See `SUPABASE_SCHEMA.md` for complete database schema

## Configuration

### Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (required, stored in Replit Secrets)
- `SUPABASE_URL`: Supabase project URL (required for database features)
- `SUPABASE_ANON_KEY`: Supabase anonymous/public key (required for database features)

### Development Server
- Port: 5000 (configured for Replit webview)
- Host: 0.0.0.0
- HMR: Enabled with clientPort 443 for Replit proxy compatibility

### Deployment
- Type: Static site
- Build command: `npm run build`
- Output directory: `dist`

## Running the Application

### Development
The application runs automatically via the "Start application" workflow:
```bash
npm run dev
```
This starts Vite dev server on port 5000.

### Production Build
```bash
npm run build
```
Output will be in the `dist` directory.

### Preview Production Build
```bash
npm run preview
```

## API Integration

### Gemini AI Service
Located in `services/geminiService.ts`, provides two main functions:

1. **generateDailyPlan(profile, previousPlan?)**: Generates a complete daily nutrition and workout plan
   - Uses structured JSON schema for consistent responses
   - Avoids repeating previous meals/workouts
   - Returns: DailyPlan object with meals, macros, shopping list, workout, and tips

2. **askNutri(profile, plan, question)**: Chat interface with AI nutritionist
   - Context-aware based on user profile and current plan
   - Returns short, helpful responses in Brazilian Portuguese

### Security Note
The API key is injected at build time through Vite's environment variable system. While this app uses client-side API calls (following the original AI Studio pattern), be aware that the API key will be visible in the production bundle. For production use, consider implementing a backend proxy to secure the API key.

## User Preferences
- Language: Brazilian Portuguese (PT-BR)
- Meal suggestions should be region-appropriate (based on user's location)
- Progressive onboarding flow (3 steps)
- Clean, modern UI with green primary color (#10b981)

## Known Limitations
1. Tailwind CSS loaded via CDN (not recommended for production - consider installing as PostCSS plugin)
2. Client-side API key exposure (consider backend proxy for production)
3. HMR WebSocket may show connection warnings in Replit environment (does not affect functionality)
4. No user authentication system (all data stored locally)
5. No backend database (all data stored in browser localStorage)

## Future Enhancements
- Install Tailwind CSS as a PostCSS plugin for production
- Add backend server to secure API keys
- Implement user authentication and cloud storage
- Add meal plan history tracking with charts
- Support for multiple languages
- Export meal plans and shopping lists as PDF
