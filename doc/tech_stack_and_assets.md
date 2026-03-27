# HCS Alumni Project: Tech Stack & Assets

A comprehensive list of the technologies, libraries, and architectural components used in this project.

## 🚀 Core Framework & Language
- **Next.js 16.2.1 (Canary)**: Leveraging the latest App Router features.
- **React 19.2.4**: Using the newest React 19 features and hooks.
- **TypeScript 5**: For robust type safety.

## 🎨 Styling & Design
- **Tailwind CSS 4**: Modern, utility-first CSS framework.
- **Framer Motion 12.38.0**: For premium animations and transitions.
- **Lucide React 1.7.0**: A library of beautiful, consistent SVG icons.

### 🔡 Fonts (via `next/font/google`)
- **Inter**: Primary font for Latin characters.
- **Noto Sans Bengali**: Primary font for Bengali text.

## 🛠️ Libraries & Dependencies
- **@supabase/supabase-js**: Official client for database and authentication.
- **clsx & tailwind-merge**: Utilities for dynamic and conflict-free CSS classes.
- **babel-plugin-react-compiler**: Optimizing React performance.

## 🏗️ Architectural Components

### Layout Components
- [Navbar.tsx](file:///home/mahtab/Work/hcs-alumuni/src/components/layout/Navbar.tsx): Global navigation with mobile support.
- [Footer.tsx](file:///home/mahtab/Work/hcs-alumuni/src/components/layout/Footer.tsx): Information and quick links footer.
- [AdminSidebar.tsx](file:///home/mahtab/Work/hcs-alumuni/src/components/admin/AdminSidebar.tsx): Dashboard navigation for administrative users.

### Registration Strategy
- [RegistrationContext.tsx](file:///home/mahtab/Work/hcs-alumuni/src/components/registration/RegistrationContext.tsx): React Context for multi-step form state management.
- [Stepper.tsx](file:///home/mahtab/Work/hcs-alumuni/src/components/registration/Stepper.tsx): Visual progress indicator for the registration wizard.
- [Step1.tsx](file:///home/mahtab/Work/hcs-alumuni/src/components/registration/Step1.tsx) to [Step5.tsx](file:///home/mahtab/Work/hcs-alumuni/src/components/registration/Step5.tsx): Modular registration segments (Personal, Academic, Contact, Participation, Review).

### Data & Cloud Integration
- **Supabase (PostgreSQL)**: Managed database with Row Level Security (RLS).
- **Cloudinary**: Cloud-based image management for profile photos and certificates.
- [supabase.ts](file:///home/mahtab/Work/hcs-alumuni/src/lib/supabase.ts) & [supabase-admin.ts](file:///home/mahtab/Work/hcs-alumuni/src/lib/supabase-admin.ts): Supabase client configurations.
- [cloudinary.ts](file:///home/mahtab/Work/hcs-alumuni/src/lib/cloudinary.ts): Utility for direct client-side media uploads.

## 📂 Project Structure Overview
- `/src/app`: App Router pages and Server Actions.
- `/src/components`: UI components organized by feature (Admin, Registration, Layout).
- `/src/lib`: Database utilities, Cloudinary services, and core logic.
- `/src/types`: Centralized TypeScript interfaces and types.
- `schema.sql`: Full database schema for Supabase initialization.
- `test-infra.js`: Connectivity and smoke-test infrastructure.
