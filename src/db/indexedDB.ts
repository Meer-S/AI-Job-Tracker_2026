import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Job, AiSettings } from '../types/job';

interface JobTrackerDB extends DBSchema {
  jobs: {
    key: string;
    value: Job;
    indexes: { 'by-status': string; 'by-company': string };
  };
}

const DB_NAME = 'AI_JobTracker_DB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<JobTrackerDB>> | null = null;

export const getDB = async (): Promise<IDBPDatabase<JobTrackerDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<JobTrackerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('jobs')) {
          const store = db.createObjectStore('jobs', { keyPath: 'id' });
          store.createIndex('by-status', 'status');
          store.createIndex('by-company', 'company');
        }
      },
    });
  }
  return dbPromise;
};

// Seed sample IT jobs for impressive initial experience
const SAMPLE_JOBS: Job[] = [
  {
    id: 'sample-job-1',
    company: 'Vercel',
    title: 'Senior Full Stack Engineer',
    url: 'https://vercel.com/careers/senior-fullstack',
    status: 'interviewing',
    techStack: ['Next.js', 'React', 'TypeScript', 'Rust', 'Tailwind', 'AWS'],
    referral: {
      name: 'Alex Rivera',
      contact: 'alex.rivera@vercel.com (LinkedIn)',
      lastPingedDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    },
    assets: {
      resumeVersion: 'FullStack_Staff_v5',
      portfolioUrl: 'https://github.com/dev-pro',
      notes: 'Had initial call with Director of Eng. Focus on Edge Functions performance.',
    },
    financials: {
      salaryRange: '$180k - $220k + Equity',
      baseSalary: 195000,
      bonus: 25000,
      currency: 'USD',
    },
    workMode: 'Remote',
    location: 'San Francisco, CA / Remote',
    timeline: [
      {
        id: 't-1',
        timestamp: new Date(Date.now() - 86400000 * 14).toISOString(),
        toStatus: 'applied',
        note: 'Submitted application via employee referral',
      },
      {
        id: 't-2',
        timestamp: new Date(Date.now() - 86400000 * 9).toISOString(),
        fromStatus: 'applied',
        toStatus: 'screening',
        note: 'Recruiter screen scheduled',
      },
      {
        id: 't-3',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
        fromStatus: 'screening',
        toStatus: 'interviewing',
        note: 'Passed OA, moved to System Design panel',
      },
    ],
    interviewPipeline: [
      { id: 'i-1', stage: 'Technical Screening / OA', date: '2026-08-12', completed: true, notes: 'CodeSignal score: 840/850' },
      { id: 'i-2', stage: 'Live Coding / Practical Assessment', date: '2026-08-18', completed: true, notes: 'React state & custom hooks live demo' },
      { id: 'i-3', stage: 'Architecture & System Design', date: '2026-08-25', completed: false, notes: 'Edge deployment & CDN caching architecture' },
      { id: 'i-4', stage: 'Cultural / Leadership Fit / HR', date: '2026-08-28', completed: false },
    ],
    aiData: {
      parsedCompetencies: [
        'React 18 & Server Components',
        'Rust microservices performance tuning',
        'Global CDN caching strategy',
        'TypeScript strict system architecture'
      ],
      requiredExperience: '5+ years software engineering, 2+ years Rust or Next.js edge runtime',
      generatedQuestions: [
        'How do Server Components handle streaming data hydrations under high latency?',
        'Describe your approach to zero-downtime database migrations with Prisma/PostgreSQL.',
        'How would you architect an edge cache invalidation strategy for multi-region APIs?'
      ],
      coldMessages: {
        recruiter: 'Hi Sarah, I noticed Vercel is expanding the Frontend Infrastructure team. I recently optimized our edge rendering pipeline by 40% and would love to connect about the Senior Full Stack role!',
        hiringManager: 'Hi Guillermo, massive fan of Vercel\'s latest AI SDK releases. I built several high-throughput TypeScript apps with Rust microservices and would be thrilled to bring that expertise to your team.',
      }
    },
    appliedDate: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'sample-job-2',
    company: 'Stripe',
    title: 'Lead DevOps Architect',
    url: 'https://stripe.com/jobs/lead-devops',
    status: 'screening',
    techStack: ['Kubernetes', 'Terraform', 'Go', 'Docker', 'AWS', 'Datadog', 'Prometheus'],
    referral: {
      name: 'David Chen',
      contact: 'david.chen@stripe.com',
      lastPingedDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    },
    assets: {
      resumeVersion: 'Cloud_DevOps_Architect_v4',
      portfolioUrl: 'https://linkedin.com/in/devops-lead',
    },
    financials: {
      salaryRange: '$210k - $250k Base + Equity',
      baseSalary: 230000,
      bonus: 35000,
      currency: 'USD',
    },
    workMode: 'Hybrid',
    location: 'Seattle, WA',
    timeline: [
      {
        id: 't-21',
        timestamp: new Date(Date.now() - 86400000 * 8).toISOString(),
        toStatus: 'applied',
        note: 'Applied through Stripe Career Portal',
      },
      {
        id: 't-22',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        fromStatus: 'applied',
        toStatus: 'screening',
        note: 'Recruiter outreach email received',
      },
    ],
    interviewPipeline: [
      { id: 'i-21', stage: 'Technical Screening / OA', date: '2026-08-24', completed: false, notes: 'Infrastructure troubleshooting & Terraform review' },
      { id: 'i-22', stage: 'Architecture & System Design', completed: false },
    ],
    aiData: {
      parsedCompetencies: [
        'Multi-region Kubernetes deployment (EKS/GKE)',
        'Infrastructure as Code (Terraform Enterprise)',
        'PCI-DSS compliance automation',
        'Go operator development'
      ],
      requiredExperience: '7+ years Infrastructure/DevOps, 3+ years managing large-scale Kubernetes clusters',
    },
    appliedDate: new Date(Date.now() - 86400000 * 8).toISOString().split('T')[0],
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sample-job-3',
    company: 'Anthropic',
    title: 'AI Infrastructure Specialist',
    url: 'https://anthropic.com/careers/ai-infra',
    status: 'applied',
    techStack: ['Python', 'PyTorch', 'CUDA', 'Distributed Systems', 'Ray', 'Kubernetes'],
    assets: {
      resumeVersion: 'AI_Infra_Specialist_v2',
    },
    financials: {
      salaryRange: '$220k - $270k',
      baseSalary: 240000,
      bonus: 40000,
      currency: 'USD',
    },
    workMode: 'Remote',
    location: 'San Francisco, CA / Remote',
    timeline: [
      {
        id: 't-31',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        toStatus: 'applied',
        note: 'Submitted application with customized AI research cover letter',
      },
    ],
    interviewPipeline: [
      { id: 'i-31', stage: 'Technical Screening / OA', completed: false },
    ],
    appliedDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'sample-job-4',
    company: 'Cloudflare',
    title: 'Principal Cloud Security Engineer',
    url: 'https://cloudflare.com/careers/security-principal',
    status: 'offered',
    techStack: ['Rust', 'eBPF', 'Linux', 'Go', 'Cloud Security', 'Zero Trust'],
    financials: {
      salaryRange: '$230k - $260k + $80k Equity',
      baseSalary: 245000,
      bonus: 30000,
      currency: 'USD',
    },
    workMode: 'Remote',
    location: 'Austin, TX / Remote',
    timeline: [
      {
        id: 't-41',
        timestamp: new Date(Date.now() - 86400000 * 30).toISOString(),
        toStatus: 'applied',
      },
      {
        id: 't-42',
        timestamp: new Date(Date.now() - 86400000 * 20).toISOString(),
        fromStatus: 'applied',
        toStatus: 'interviewing',
      },
      {
        id: 't-43',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        fromStatus: 'interviewing',
        toStatus: 'offered',
        note: 'Received formal offer letter! Negotiating start date.',
      },
    ],
    interviewPipeline: [
      { id: 'i-41', stage: 'Technical Screening / OA', completed: true },
      { id: 'i-42', stage: 'Live Coding / Practical Assessment', completed: true },
      { id: 'i-43', stage: 'Architecture & System Design', completed: true },
      { id: 'i-44', stage: 'Cultural / Leadership Fit / HR', completed: true },
    ],
    appliedDate: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0],
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'sample-job-5',
    company: 'Linear',
    title: 'Staff Product Manager',
    url: 'https://linear.app/careers/staff-pm',
    status: 'bookmarked',
    techStack: ['Product Strategy', 'GraphQL', 'React', 'Analytics', 'Figma'],
    financials: {
      salaryRange: '$190k - $230k',
      baseSalary: 210000,
      currency: 'USD',
    },
    workMode: 'Remote',
    location: 'Remote',
    timeline: [
      {
        id: 't-51',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        toStatus: 'bookmarked',
        note: 'Saved job posting for referral reachout',
      },
    ],
    interviewPipeline: [],
    appliedDate: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

export const getAllJobs = async (): Promise<Job[]> => {
  const db = await getDB();
  const jobs = await db.getAll('jobs');
  if (jobs.length === 0) {
    // Seed initial data
    const tx = db.transaction('jobs', 'readwrite');
    for (const job of SAMPLE_JOBS) {
      await tx.store.put(job);
    }
    await tx.done;
    return SAMPLE_JOBS;
  }
  return jobs;
};

export const getJobById = async (id: string): Promise<Job | undefined> => {
  const db = await getDB();
  return db.get('jobs', id);
};

export const saveJob = async (job: Job): Promise<void> => {
  const db = await getDB();
  await db.put('jobs', job);
};

export const deleteJob = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('jobs', id);
};

export const bulkImportJobs = async (jobs: Job[], overwrite = false): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction('jobs', 'readwrite');
  if (overwrite) {
    await tx.store.clear();
  }
  for (const job of jobs) {
    await tx.store.put(job);
  }
  await tx.done;
};

export const exportAllData = async (): Promise<string> => {
  const jobs = await getAllJobs();
  const settings = getAiSettings();
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    jobs,
    settings,
  };
  return JSON.stringify(backup, null, 2);
};

// AI Settings LocalStorage Persistence
const AI_SETTINGS_KEY = 'ai_job_tracker_settings';

export const getAiSettings = (): AiSettings => {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read AI settings', e);
  }
  return {
    provider: 'offline',
    ollamaUrl: 'http://localhost:11434',
    modelName: 'llama3',
  };
};

export const saveAiSettings = (settings: AiSettings): void => {
  try {
    localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save AI settings', e);
  }
};
