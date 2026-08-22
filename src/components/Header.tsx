import React from 'react';
import { 
  Kanban, 
  Table as TableIcon, 
  Plus, 
  BarChart3, 
  Settings, 
  Download, 
  Upload, 
  Search, 
  Sparkles,
  Briefcase
} from 'lucide-react';
import { WorkMode, JobStatus } from '../types/job';

interface HeaderProps {
  viewMode: 'kanban' | 'table';
  setViewMode: (mode: 'kanban' | 'table') => void;
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTechFilter: string;
  setSelectedTechFilter: (tech: string) => void;
  selectedWorkMode: string;
  setSelectedWorkMode: (mode: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (status: string) => void;
  allTechTags: string[];
  onOpenNewJobModal: () => void;
  onOpenSettingsModal: () => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
  jobCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  showAnalytics,
  setShowAnalytics,
  searchQuery,
  setSearchQuery,
  selectedTechFilter,
  setSelectedTechFilter,
  selectedWorkMode,
  setSelectedWorkMode,
  selectedStatusFilter,
  setSelectedStatusFilter,
  allTechTags,
  onOpenNewJobModal,
  onOpenSettingsModal,
  onExportJSON,
  onImportJSON,
  jobCount,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    AI Job Tracker
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Pro
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span>Local-First IT Pipeline</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-indigo-400/90 font-medium">{jobCount} Applications</span>
                </p>
              </div>
            </div>

            {/* Mobile View Switcher */}
            <div className="flex items-center gap-1 md:hidden">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg text-xs font-medium ${
                  viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Kanban className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-medium ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search & Filters Bar */}
          <div className="flex-1 max-w-2xl w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search company, title, tech stack (e.g. Kubernetes, Rust)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <select
              value={selectedTechFilter}
              onChange={(e) => setSelectedTechFilter(e.target.value)}
              className="hidden lg:block py-2 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">All Tech Stacks</option>
              {allTechTags.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>

            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="hidden lg:block py-2 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
              <option value="Relocation Required">Relocation</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            
            {/* View Toggle */}
            <div className="hidden md:flex items-center p-1 bg-slate-900/80 rounded-lg border border-slate-800">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>

            {/* Analytics Toggle */}
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                showAnalytics
                  ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title="Toggle Analytics Dashboard"
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Metrics</span>
            </button>

            {/* Backup / Restore Dropdown & Settings */}
            <div className="flex items-center space-x-1 border-l border-slate-800 pl-2">
              <button
                onClick={onExportJSON}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-all"
                title="Export Backup JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onImportJSON}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-all"
                title="Import Backup JSON"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenSettingsModal}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-all"
                title="AI Settings & Config"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* + Add New Job */}
            <button
              onClick={onOpenNewJobModal}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
