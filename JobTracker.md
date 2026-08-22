# Ultimate AI-Powered IT Job Tracker (Market-Ready & Role-Agnostic)

## 1. Core Objective
Build a professional, local-first Kanban Job Tracker designed for the modern IT professional. This tool is built to handle the complexities of technical hiring pipelines across all disciplines—including Software Engineering, Cloud/DevOps, Data Science, Cybersecurity, and Product Management. The application must be a Single Page Application (SPA) that runs entirely on `localhost` with 100% data privacy.

## 2. Tech Stack & Architecture
- **Framework:** React 18+ (Vite) + TypeScript (Strict mode).
- **Persistence:** `idb` (IndexedDB wrapper) for zero-latency, local data storage.
- **Styling:** Tailwind CSS (Clean, Minimalist UI) + `lucide-react` for iconography.
- **Drag-and-Drop:** `@dnd-kit/core` with `SortableContext`.
- **Animations:** `framer-motion` for smooth UI transitions and card movements.

## 3. Universal IT Data Model
Each Job Card must store:
- **Core Info:** Company Name, Job Title (e.g., "Senior SDE", "DevOps Architect"), LinkedIn/Job URL.
- **Tech Stack Profiling:** Array of tags (e.g., ["Kubernetes", "Rust", "PostgreSQL", "React", "AWS"]).
- **Networking:** Referral Name, Contact Info, and "Last Pinged" date.
- **Assets:** Linked Resume version used (e.g., "FullStack_v4") and Portfolio/Cover Letter links.
- **Financials:** Salary Range (Text), Base, and Bonus components.
- **Work Mode:** Remote, Hybrid, Onsite, or Relocation Required.
- **Timeline:** Automatic history log of status changes.
- **Interview Pipeline:** Flexible sub-tracking for technical milestones:
  - Technical Screening / OA
  - Live Coding / Practical Assessment
  - Architecture & System Design
  - Cultural / Leadership Fit / HR

## 4. Advanced AI Integration (Interface Only)
A side-panel "AI Copilot" for each job card to streamline application and prep:
- **JD Parser:** Textarea to paste a Job Description → Extract key technical competencies and required years of experience.
- **Interview Prep:** Generate 5-10 tailored technical questions based on the *Tech Stack Tags* and the specific JD.
- **Cold Message Generator:** Draft personalized LinkedIn connection requests or follow-up emails for recruiters/hiring managers.
- **API Support:** Settings page to input an OpenAI/Anthropic API Key (LocalStorage only) or a local Ollama endpoint.

## 5. UI/UX Requirements
- **Theme:** Professional "Dark Mode" by default (Linear/Vercel-inspired aesthetic).
- **Views:** Toggle between a **Visual Kanban Board** and a high-density **Searchable Table View**.
- **Global Search:** Find jobs by Tech Stack, Company, Role, or Status.
- **Analytics Dashboard:** A header or sidebar showing:
  - Total Applications this week/month.
  - Interview Conversion Rate (%).
  - Active Pipeline Value.
  - GitHub-style Activity Heatmap of applications.

## 6. Data Reliability & Portability
- **JSON Backup:** One-click `Export to JSON` for manual backups.
- **Restore:** `Import from JSON` with merge/overwrite options.
- **Offline First:** No external database or API calls required for core functionality.

---

### **Implementation Instructions for AI Developer:**
1.  **Phase 1:** Scaffold Vite + Tailwind + TypeScript.
2.  **Phase 2:** Initialize IndexedDB schema with a versioned `jobs` store.
3.  **Phase 3:** Build the Kanban board with drag-and-drop functionality using `@dnd-kit`.
4.  **Phase 4:** Create the "Job Detail" slide-over/modal with the AI Copilot Side-panel.
5.  **Phase 5:** Implement Table View, Global Search, and JSON Import/Export logic.
