import React, { useState, useEffect, useMemo } from 'react';
import { Job, JobStatus, AiSettings } from './types/job';
import { 
  getAllJobs, 
  saveJob, 
  deleteJob, 
  bulkImportJobs, 
  exportAllData, 
  getAiSettings, 
  saveAiSettings 
} from './db/indexedDB';
import { Header } from './components/Header';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { JobTable } from './components/TableView/JobTable';
import { JobModal } from './components/JobModal/JobModal';
import { SettingsModal } from './components/SettingsModal';
import { Sparkles, Layers, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // View & UI State
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [showAnalytics, setShowAnalytics] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTechFilter, setSelectedTechFilter] = useState<string>('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');

  // Modal State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState<boolean>(false);
  const [defaultNewStatus, setDefaultNewStatus] = useState<JobStatus>('applied');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // AI Settings State
  const [aiSettings, setAiSettings] = useState<AiSettings>(getAiSettings());

  // Load initial data from IndexedDB
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (e) {
      console.error('Failed to load jobs from IndexedDB', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Collect all unique tech tags across all jobs for filter dropdown
  const allTechTags = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      j.techStack.forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, [jobs]);

  // Filtered jobs array based on search and selected dropdown filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Global Search Match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const companyMatch = job.company.toLowerCase().includes(q);
        const titleMatch = job.title.toLowerCase().includes(q);
        const techMatch = job.techStack.some((t) => t.toLowerCase().includes(q));
        const statusMatch = job.status.toLowerCase().includes(q);
        const locationMatch = job.location?.toLowerCase().includes(q) || false;
        if (!companyMatch && !titleMatch && !techMatch && !statusMatch && !locationMatch) {
          return false;
        }
      }

      // Tech Stack Filter
      if (selectedTechFilter && !job.techStack.includes(selectedTechFilter)) {
        return false;
      }

      // Work Mode Filter
      if (selectedWorkMode && job.workMode !== selectedWorkMode) {
        return false;
      }

      // Status Filter
      if (selectedStatusFilter && job.status !== selectedStatusFilter) {
        return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedTechFilter, selectedWorkMode, selectedStatusFilter]);

  // Handlers
  const handleUpdateJobStatus = async (jobId: string, newStatus: JobStatus) => {
    const jobToUpdate = jobs.find((j) => j.id === jobId);
    if (!jobToUpdate) return;

    const nowIso = new Date().toISOString();
    const updatedJob: Job = {
      ...jobToUpdate,
      status: newStatus,
      updatedAt: nowIso,
      timeline: [
        ...jobToUpdate.timeline,
        {
          id: `t-${Date.now()}`,
          timestamp: nowIso,
          fromStatus: jobToUpdate.status,
          toStatus: newStatus,
          note: `Moved card to ${newStatus}`,
        },
      ],
    };

    // Optimistic UI update
    setJobs((prev) => prev.map((j) => (j.id === jobId ? updatedJob : j)));
    await saveJob(updatedJob);
  };

  const handleSaveJob = async (savedJob: Job) => {
    setJobs((prev) => {
      const exists = prev.some((j) => j.id === savedJob.id);
      if (exists) {
        return prev.map((j) => (j.id === savedJob.id ? savedJob : j));
      }
      return [savedJob, ...prev];
    });
    await saveJob(savedJob);
  };

  const handleDeleteJob = async (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    await deleteJob(jobId);
  };

  const handleSaveAiSettings = (newSettings: AiSettings) => {
    setAiSettings(newSettings);
    saveAiSettings(newSettings);
  };

  const handleExportJSON = async () => {
    const jsonStr = await exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_JobTracker_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = async (file: File, overwrite: boolean) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        if (data.jobs && Array.isArray(data.jobs)) {
          await bulkImportJobs(data.jobs, overwrite);
          await fetchJobs();
          alert(`Successfully imported ${data.jobs.length} job cards!`);
        } else {
          alert('Invalid backup JSON format.');
        }
      };
      reader.readAsText(file);
    } catch (err) {
      console.error('Import failed', err);
      alert('Failed to parse backup JSON file.');
    }
  };

  const handleOpenNewJobModal = (status?: JobStatus) => {
    setSelectedJob(null);
    setDefaultNewStatus(status || 'applied');
    setIsJobModalOpen(true);
  };

  const handleOpenDetailModal = (job: Job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header Navigation */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        showAnalytics={showAnalytics}
        setShowAnalytics={setShowAnalytics}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTechFilter={selectedTechFilter}
        setSelectedTechFilter={setSelectedTechFilter}
        selectedWorkMode={selectedWorkMode}
        setSelectedWorkMode={setSelectedWorkMode}
        selectedStatusFilter={selectedStatusFilter}
        setSelectedStatusFilter={setSelectedStatusFilter}
        allTechTags={allTechTags}
        onOpenNewJobModal={() => handleOpenNewJobModal('applied')}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onExportJSON={handleExportJSON}
        onImportJSON={() => setIsSettingsModalOpen(true)}
        jobCount={filteredJobs.length}
      />

      {/* Collapsible Analytics Metrics Dashboard */}
      {showAnalytics && <AnalyticsDashboard jobs={jobs} />}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4">
        
        {/* Active Filter Chips Bar */}
        {(selectedTechFilter || selectedWorkMode || selectedStatusFilter || searchQuery) && (
          <div className="mb-4 flex flex-wrap items-center gap-2 p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Active Filters:</span>

            {searchQuery && (
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-white">×</button>
              </span>
            )}

            {selectedTechFilter && (
              <span className="px-2.5 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                Tech: {selectedTechFilter}
                <button onClick={() => setSelectedTechFilter('')} className="hover:text-white">×</button>
              </span>
            )}

            {selectedWorkMode && (
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                Mode: {selectedWorkMode}
                <button onClick={() => setSelectedWorkMode('')} className="hover:text-white">×</button>
              </span>
            )}

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTechFilter('');
                setSelectedWorkMode('');
                setSelectedStatusFilter('');
              }}
              className="text-indigo-400 hover:underline font-medium text-[11px] ml-auto"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* View Component Render */}
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Initializing IndexedDB Pipeline...</p>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            jobs={filteredJobs}
            onUpdateJobStatus={handleUpdateJobStatus}
            onOpenDetail={handleOpenDetailModal}
            onAddNewInColumn={(status) => handleOpenNewJobModal(status)}
          />
        ) : (
          <JobTable
            jobs={filteredJobs}
            onOpenDetail={handleOpenDetailModal}
            onUpdateJobStatus={handleUpdateJobStatus}
            onDeleteJob={handleDeleteJob}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ultimate AI-Powered IT Job Tracker — Local-First & 100% Private</span>
          </div>
          <p className="text-slate-400">
            Powered by React 18, Vite, TypeScript, Tailwind CSS, IndexedDB & @dnd-kit
          </p>
        </div>
      </footer>

      {/* Full Job Card Detail & AI Copilot Modal */}
      <JobModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSave={handleSaveJob}
        onDelete={handleDeleteJob}
        aiSettings={aiSettings}
        defaultStatus={defaultNewStatus}
      />

      {/* AI Settings & Data Backup Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={aiSettings}
        onSaveSettings={handleSaveAiSettings}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
      />

    </div>
  );
};
