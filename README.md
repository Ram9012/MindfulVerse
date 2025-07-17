## Global Mental Health Crisis
Mental health disorders are a leading cause of disability worldwide. According to the World Health Organization (WHO), approximately 1 in 8 people globally live with a mental disorder. Depression affects over 280 million people , and suicide is the fourth leading cause of death among 15-29-year-olds . The COVID-19 pandemic has further exacerbated mental health issues, with a reported 25% increase in anxiety and depression worldwide. Despite the scale of the problem, access to quality mental health care remains limited due to stigma, lack of resources, and insufficient mental health professionals.

## Project Goal
Mindful Verse Nexus aims to bridge the gap between those in need and mental health support by leveraging technology to:

- Provide accessible, AI-powered tools for both patients and therapists
- Facilitate early detection and intervention for mental health issues
- Empower therapists with data-driven insights
- Foster a supportive, stigma-free environment for users
## Features
### For Patients
- AI Chatbot: Engage in supportive conversations, receive emotional analysis, and get personalized coping strategies.
- Session Tracking: Record and review therapy sessions, track emotional progress, and receive summaries.
- Community Support: Connect with peers in a safe, moderated environment.
- Relaxation Tools: Access guided relaxation and mindfulness exercises.
- Progress Dashboard: Visualize emotional trends and therapy milestones.
### For Therapists
- Session Analytics: Automatic emotion, theme, and cognitive distortion detection from transcripts.
- Patient Management: Securely manage patient profiles and session histories.
- Dashboard: Overview of patient progress, session summaries, and actionable insights.
- Research Tools: Export anonymized data for research and outcome tracking.
## Project Structure & Important Files
- backend/
  - app.py : Main backend application (Flask API), handles authentication, session management, transcript analysis, and integrates AI models.
  - gemini services for various tasks like pdf reading, etc.
- frontend/
  - api.py : Handles API requests from the frontend to the backend.
  - bun.lockb : Dependency lockfile for Bun (JavaScript package manager).
  - package.json : Lists frontend dependencies and scripts.
  - vite.config.ts : Vite build tool configuration for the frontend.
  - vite.config.ts.timestamp-*.mjs : Temporary build/cache files (can be ignored).
- src/
  - App.tsx : Main React app entry point.
  - components/ : UI components for dashboard, sessions, layout, etc.
  - hooks/ : Custom React hooks (e.g., for authentication, mobile detection).
  - lib/ : Utility libraries (API service, context providers).
  - pages/ : Main app pages (Chatbot, Community, Sessions, TherapistDashboard, etc.).
- public/ : Static assets (SVGs, robots.txt, etc.).
- uploads/ : User-uploaded files (should be gitignored for privacy).
- session_dashboard_output.json : Session analytics (should be gitignored).
## How This Project Solves the Problem
Mindful Verse Nexus combines AI-driven analysis, secure data management, and user-friendly interfaces to:

- Lower barriers to mental health support
- Provide actionable insights for therapists
- Provides an AI companion for therapists to plan and discuss with
- Reduces manual labor for therapists
- Empower patients to track and improve their mental well-being
- Contribute to research and awareness in the mental health field
