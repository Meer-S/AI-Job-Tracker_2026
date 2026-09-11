# AI Job Tracker

A local-first, privacy-focused job application tracker for modern IT roles. Manage applications across software engineering, cloud and DevOps, data, cybersecurity, product, and other technical disciplines from a visual Kanban board or a searchable table.

All core job data is stored in your browser's IndexedDB. The application runs locally with Vite and does not require an external database.

## Features

### Job pipeline

- Kanban board with drag-and-drop status updates.
- Table view for dense scanning, status changes, and deletion.
- Pipeline statuses for bookmarked, applied, screening, interviewing, offered, rejected, and archived jobs.
- Add jobs directly to a selected Kanban column.
- Automatic status-change timeline entries.
- Flexible interview milestones, including:
  - Technical Screening / OA
  - Live Coding / Practical Assessment
  - Architecture & System Design
  - Cultural / Leadership Fit / HR
  - Custom stages

### Job details

Each job can include:

- Company, role, job URL, location, and work mode.
- Technology stack tags.
- Referral name, contact details, and last-pinged date.
- Resume version, portfolio link, cover letter link, and notes.
- Salary range, base salary, bonus, and currency.
- Interview dates, completion state, and notes.
- Status history and timestamps.

### Search, filters, and analytics

- Global search across company, title, technology tags, status, and location.
- Filter by technology, work mode, and status.
- Applications this week and month.
- Interview conversion rate.
- Active pipeline salary value.
- Frequently targeted technology stacks.
- Application activity heatmap.

### AI Copilot

The job detail modal includes an AI Copilot with three workflows:

- **JD Parser:** Extract technical competencies and required experience from pasted job descriptions.
- **Interview Prep:** Generate tailored technical questions from the role, company, tech stack, and job description.
- **Outreach:** Draft recruiter, hiring manager, and peer messages.

The default provider is an offline heuristic engine. Optional provider settings support OpenAI, Anthropic, and a local Ollama endpoint. API settings are stored in browser LocalStorage.

### Backup and restore

- Export jobs and AI settings to a timestamped JSON backup.
- Import a backup by merging jobs or overwriting the local job store.
- Core functionality remains available without a backend or external database.

## Tech stack

- React 18
- TypeScript with strict mode
- Vite
- Tailwind CSS
- IndexedDB through `idb`
- `@dnd-kit` for drag-and-drop
- Framer Motion for UI animation
- Lucide React for icons

## Requirements

- Node.js 18 or newer
- npm
- A modern browser with IndexedDB and LocalStorage support

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:3000
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The package currently includes a `lint` script, but ESLint must be installed and configured before `npm run lint` can run successfully.

## How to use

1. Start the development server.
2. Review the seeded example applications on the Kanban board.
3. Select **New Job** to create an application.
4. Drag a card between columns to update its status, or edit the status in the job detail modal.
5. Open a card to maintain interview milestones, assets, compensation, notes, and AI Copilot data.
6. Use the search box and filters to narrow the pipeline.
7. Open settings to configure an AI provider or export/import a JSON backup.

## Data and privacy

Job records are stored in the browser's IndexedDB database named `AI_JobTracker_DB`. AI settings are stored in LocalStorage under the key `ai_job_tracker_settings`.

The offline provider does not require network access. If OpenAI, Anthropic, or Ollama is configured, the relevant AI actions may send the supplied job-description and role context to that provider or local endpoint. Review provider policies before using confidential information.

Clearing browser site data removes locally stored jobs and settings. Use **Export JSON** regularly if the data is important.

## Project structure

```text
src/
  App.tsx                         Application state and view orchestration
  components/
    AnalyticsDashboard.tsx        Pipeline metrics and activity heatmap
    Header.tsx                    Search, filters, navigation, and data actions
    SettingsModal.tsx             AI provider settings and backup/restore
    JobModal/                     Job editing and AI Copilot workflows
    KanbanBoard/                  Drag-and-drop board and job cards
    TableView/                    Searchable table representation
  db/indexedDB.ts                 IndexedDB schema, seed data, and portability
  services/aiService.ts           Offline and optional provider AI workflows
  types/job.ts                    Shared domain types
```

## Development notes

- Keep changes local-first and avoid introducing a required backend for core workflows.
- Update the IndexedDB version and upgrade path when changing the persisted schema.
- Prefer the existing shared types in `src/types/job.ts` rather than duplicating job shapes in components.
- Keep AI provider behavior behind `src/services/aiService.ts`.
- Preserve the existing dark UI, Tailwind utility conventions, Lucide iconography, and accessible interactive controls.

## License

No license has been specified for this project yet.
