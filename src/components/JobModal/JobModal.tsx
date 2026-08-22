import React, { useState, useEffect } from 'react';
import { Job, JobStatus, WorkMode, InterviewMilestone, AiSettings } from '../../types/job';
import { AiService } from '../../services/aiService';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Briefcase
} from 'lucide-react';

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: Job) => void;
  onDelete?: (jobId: string) => void;
  aiSettings: AiSettings;
  defaultStatus?: JobStatus;
}

export const JobModal: React.FC<JobModalProps> = ({
  job,
  isOpen,
  onClose,
  onSave,
  onDelete,
  aiSettings,
  defaultStatus = 'applied',
}) => {
  // Form State
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<JobStatus>(defaultStatus);
  const [workMode, setWorkMode] = useState<WorkMode>('Remote');
  const [location, setLocation] = useState('');
  
  // Tech Stack Array
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  // Referral
  const [refName, setRefName] = useState('');
  const [refContact, setRefContact] = useState('');
  const [refLastPinged, setRefLastPinged] = useState('');

  // Assets
  const [resumeVersion, setResumeVersion] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverLetterUrl, setCoverLetterUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Financials
  const [salaryRange, setSalaryRange] = useState('');
  const [baseSalary, setBaseSalary] = useState<number | undefined>(undefined);
  const [bonus, setBonus] = useState<number | undefined>(undefined);

  // Interview Pipeline Milestones
  const [interviewPipeline, setInterviewPipeline] = useState<InterviewMilestone[]>([]);
  const [newStageName, setNewStageName] = useState('');

  // Side-Panel AI Copilot State
  const [activeCopilotTab, setActiveCopilotTab] = useState<'jd' | 'prep' | 'outreach'>('jd');
  const [jdText, setJdText] = useState('');
  const [isParsingJd, setIsParsingJd] = useState(false);
  const [isGeneratingPrep, setIsGeneratingPrep] = useState(false);
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);

  const [aiCompetencies, setAiCompetencies] = useState<string[]>([]);
  const [aiExp, setAiExp] = useState('');
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [aiMessages, setAiMessages] = useState<{ recruiter?: string; hiringManager?: string; peer?: string }>({});
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load job into form state when modal opens
  useEffect(() => {
    if (job) {
      setCompany(job.company || '');
      setTitle(job.title || '');
      setUrl(job.url || '');
      setStatus(job.status || 'applied');
      setWorkMode(job.workMode || 'Remote');
      setLocation(job.location || '');
      setTechStack(job.techStack || []);
      
      setRefName(job.referral?.name || '');
      setRefContact(job.referral?.contact || '');
      setRefLastPinged(job.referral?.lastPingedDate || '');

      setResumeVersion(job.assets?.resumeVersion || '');
      setPortfolioUrl(job.assets?.portfolioUrl || '');
      setCoverLetterUrl(job.assets?.coverLetterUrl || '');
      setNotes(job.assets?.notes || '');

      setSalaryRange(job.financials?.salaryRange || '');
      setBaseSalary(job.financials?.baseSalary);
      setBonus(job.financials?.bonus);

      setInterviewPipeline(
        job.interviewPipeline && job.interviewPipeline.length > 0
          ? job.interviewPipeline
          : [
              { id: 'i-default-1', stage: 'Technical Screening / OA', completed: false },
              { id: 'i-default-2', stage: 'Live Coding / Practical Assessment', completed: false },
              { id: 'i-default-3', stage: 'Architecture & System Design', completed: false },
              { id: 'i-default-4', stage: 'Cultural / Leadership Fit / HR', completed: false },
            ]
      );

      // AI Data
      setJdText(job.aiData?.rawJd || '');
      setAiCompetencies(job.aiData?.parsedCompetencies || []);
      setAiExp(job.aiData?.requiredExperience || '');
      setAiQuestions(job.aiData?.generatedQuestions || []);
      setAiMessages(job.aiData?.coldMessages || {});
    } else {
      // New Job defaults
      setCompany('');
      setTitle('');
      setUrl('');
      setStatus(defaultStatus);
      setWorkMode('Remote');
      setLocation('');
      setTechStack(['React', 'TypeScript', 'Node.js']);
      setRefName('');
      setRefContact('');
      setRefLastPinged('');
      setResumeVersion('FullStack_v1');
      setPortfolioUrl('');
      setCoverLetterUrl('');
      setNotes('');
      setSalaryRange('');
      setBaseSalary(undefined);
      setBonus(undefined);
      setInterviewPipeline([
        { id: 'i-1', stage: 'Technical Screening / OA', completed: false },
        { id: 'i-2', stage: 'Live Coding / Practical Assessment', completed: false },
        { id: 'i-3', stage: 'Architecture & System Design', completed: false },
        { id: 'i-4', stage: 'Cultural / Leadership Fit / HR', completed: false },
      ]);
      setJdText('');
      setAiCompetencies([]);
      setAiExp('');
      setAiQuestions([]);
      setAiMessages({});
    }
  }, [job, isOpen, defaultStatus]);

  if (!isOpen) return null;

  // Add / Remove Tech Tag
  const handleAddTechTag = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTechTag = (tag: string) => {
    setTechStack(techStack.filter((t) => t !== tag));
  };

  // Toggle Interview Milestone
  const handleToggleMilestone = (id: string) => {
    setInterviewPipeline(
      interviewPipeline.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleAddCustomMilestone = () => {
    if (newStageName.trim()) {
      setInterviewPipeline([
        ...interviewPipeline,
        { id: `milestone-${Date.now()}`, stage: newStageName.trim(), completed: false },
      ]);
      setNewStageName('');
    }
  };

  const handleRemoveMilestone = (id: string) => {
    setInterviewPipeline(interviewPipeline.filter((m) => m.id !== id));
  };

  // AI Copilot Actions
  const handleParseJd = async () => {
    if (!jdText.trim()) return;
    setIsParsingJd(true);
    const res = await AiService.parseJobDescription(jdText, techStack, aiSettings);
    setAiCompetencies(res.parsedCompetencies);
    setAiExp(res.requiredExperience);
    setIsParsingJd(false);
  };

  const handleGeneratePrep = async () => {
    setIsGeneratingPrep(true);
    const res = await AiService.generateInterviewQuestions(title, company, techStack, jdText, aiSettings);
    setAiQuestions(res.questions);
    setIsGeneratingPrep(false);
  };

  const handleGenerateOutreach = async () => {
    setIsGeneratingOutreach(true);
    const res = await AiService.generateColdMessages(title, company, techStack, notes, refName, aiSettings);
    setAiMessages(res.coldMessages);
    setIsGeneratingOutreach(false);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !title.trim()) return;

    const nowIso = new Date().toISOString();
    const todayStr = nowIso.split('T')[0];

    const updatedTimeline = job?.timeline ? [...job.timeline] : [];
    if (!job || job.status !== status) {
      updatedTimeline.push({
        id: `timeline-${Date.now()}`,
        timestamp: nowIso,
        fromStatus: job?.status,
        toStatus: status,
        note: job ? `Status updated to ${status}` : 'Application card created',
      });
    }

    const updatedJob: Job = {
      id: job ? job.id : `job-${Date.now()}`,
      company: company.trim(),
      title: title.trim(),
      url: url.trim() || undefined,
      status,
      techStack,
      workMode,
      location: location.trim() || undefined,
      referral: {
        name: refName.trim() || undefined,
        contact: refContact.trim() || undefined,
        lastPingedDate: refLastPinged || undefined,
      },
      assets: {
        resumeVersion: resumeVersion.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        coverLetterUrl: coverLetterUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      financials: {
        salaryRange: salaryRange.trim() || undefined,
        baseSalary: baseSalary ? Number(baseSalary) : undefined,
        bonus: bonus ? Number(bonus) : undefined,
      },
      timeline: updatedTimeline,
      interviewPipeline,
      aiData: {
        rawJd: jdText,
        parsedCompetencies: aiCompetencies,
        requiredExperience: aiExp,
        generatedQuestions: aiQuestions,
        coldMessages: aiMessages,
        lastAnalyzedAt: nowIso,
      },
      appliedDate: job ? job.appliedDate : todayStr,
      updatedAt: nowIso,
    };

    onSave(updatedJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {job ? `Edit Job Card — ${job.company}` : 'Add New IT Job Card'}
              </h2>
              <p className="text-xs text-slate-400">
                100% Local-First IndexedDB Storage & Copilot Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split into Form (Left) and AI Copilot (Right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* LEFT 7 COLUMNS: Data Model Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 space-y-6">
            
            {/* Core Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vercel, Stripe, Anthropic"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title / Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior SDE, DevOps Architect"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* URL, Status, WorkMode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pipeline Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as JobStatus)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="bookmarked">Wishlist / Saved</option>
                  <option value="applied">Applied</option>
                  <option value="screening">Screening / OA</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offer Received</option>
                  <option value="rejected">Closed / Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                  <option value="Relocation Required">Relocation Required</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Link / URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Tech Stack Profiling */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Tech Stack Profiling (Tags)</span>
                <span className="text-[10px] text-slate-400">Press Enter or click +</span>
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Add tech (e.g. Kubernetes, Rust, PyTorch)"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTechTag();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTechTag}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                >
                  + Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800/80"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechTag(tech)}
                      className="ml-1.5 text-indigo-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Financials & Assets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Salary Range (Text)</label>
                <input
                  type="text"
                  placeholder="e.g. $180k - $220k + Equity"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Base Salary ($ USD)</label>
                <input
                  type="number"
                  placeholder="195000"
                  value={baseSalary || ''}
                  onChange={(e) => setBaseSalary(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resume Version</label>
                <input
                  type="text"
                  placeholder="e.g. FullStack_Staff_v5"
                  value={resumeVersion}
                  onChange={(e) => setResumeVersion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Portfolio / Github URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Networking & Referral */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                Networking & Internal Referral
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Referral Name"
                  value={refName}
                  onChange={(e) => setRefName(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                />
                <input
                  type="text"
                  placeholder="Contact Info / LinkedIn"
                  value={refContact}
                  onChange={(e) => setRefContact(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                />
                <input
                  type="date"
                  placeholder="Last Pinged"
                  value={refLastPinged}
                  onChange={(e) => setRefLastPinged(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                />
              </div>
            </div>

            {/* Interview Pipeline Sub-tracking */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center justify-between uppercase tracking-wider">
                <span>Technical Interview Milestones</span>
                <span className="text-[11px] text-indigo-400 font-normal">
                  {interviewPipeline.filter(i => i.completed).length}/{interviewPipeline.length} Completed
                </span>
              </h4>

              <div className="space-y-2">
                {interviewPipeline.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <label className="flex items-center space-x-2.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        onChange={() => handleToggleMilestone(milestone.id)}
                        className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                      />
                      <span className={`text-xs ${milestone.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {milestone.stage}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(milestone.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Stage */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom milestone (e.g. VP Engineering Chat)..."
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                />
                <button
                  type="button"
                  onClick={handleAddCustomMilestone}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
                >
                  + Milestone
                </button>
              </div>
            </div>

            {/* Save & Delete Action Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {job && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete card "${job.company}"?`)) {
                      onDelete(job.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-xs font-semibold"
                >
                  Delete Job Card
                </button>
              ) : <div />}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold shadow-md"
                >
                  Save Job Card
                </button>
              </div>
            </div>

          </form>

          {/* RIGHT 5 COLUMNS: AI Copilot Side-Panel */}
          <div className="lg:col-span-5 p-6 bg-slate-950/90 flex flex-col space-y-4">
            
            {/* Copilot Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-100">AI Copilot Side-Panel</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                {aiSettings.provider === 'offline' ? 'Offline Engine' : `${aiSettings.provider} Active`}
              </span>
            </div>

            {/* Copilot Navigation Tabs */}
            <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveCopilotTab('jd')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeCopilotTab === 'jd'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                JD Parser
              </button>
              <button
                type="button"
                onClick={() => setActiveCopilotTab('prep')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeCopilotTab === 'prep'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Interview Prep
              </button>
              <button
                type="button"
                onClick={() => setActiveCopilotTab('outreach')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeCopilotTab === 'outreach'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Outreach Drafts
              </button>
            </div>

            {/* TAB 1: JD PARSER */}
            {activeCopilotTab === 'jd' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Paste Job Description (JD)
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Paste the full job posting description here to extract core technical competencies..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleParseJd}
                    disabled={isParsingJd || !jdText.trim()}
                    className="mt-2 w-full py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isParsingJd ? 'Analyzing JD...' : 'Extract Technical Competencies'}</span>
                  </button>
                </div>

                {/* Parsed Output */}
                {(aiCompetencies.length > 0 || aiExp) && (
                  <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                    {aiExp && (
                      <div>
                        <h5 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Required Experience</h5>
                        <p className="text-xs text-slate-200 mt-1 font-medium">{aiExp}</p>
                      </div>
                    )}
                    {aiCompetencies.length > 0 && (
                      <div>
                        <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1.5">Key Technical Competencies</h5>
                        <ul className="space-y-1">
                          {aiCompetencies.map((comp, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span>{comp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INTERVIEW PREP */}
            {activeCopilotTab === 'prep' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-300">
                    Generate tailored coding, system design, and architectural questions based on <strong className="text-indigo-300">{company}</strong> and your stack (<strong className="text-cyan-300">{techStack.join(', ') || 'General'}</strong>).
                  </p>
                  <button
                    type="button"
                    onClick={handleGeneratePrep}
                    disabled={isGeneratingPrep}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shadow"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{isGeneratingPrep ? 'Generating Questions...' : 'Generate 5-10 Technical Questions'}</span>
                  </button>
                </div>

                {aiQuestions.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tailored Technical Questions</h5>
                    {aiQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 relative group">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs text-slate-200 leading-relaxed font-medium">
                            <span className="text-indigo-400 font-bold mr-1.5">Q{idx + 1}.</span>
                            {q}
                          </p>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(q, `q-${idx}`)}
                            className="p-1 text-slate-500 hover:text-white"
                          >
                            {copiedKey === `q-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: OUTREACH DRAFTS */}
            {activeCopilotTab === 'outreach' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={handleGenerateOutreach}
                  disabled={isGeneratingOutreach}
                  className="w-full py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isGeneratingOutreach ? 'Drafting Messages...' : 'Draft Networking Messages'}</span>
                </button>

                {aiMessages.recruiter && (
                  <div className="space-y-3">
                    
                    {/* Recruiter Outreach */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">Recruiter Connection Request</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(aiMessages.recruiter!, 'rec')}
                          className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white"
                        >
                          {copiedKey === 'rec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        {aiMessages.recruiter}
                      </p>
                    </div>

                    {/* Hiring Manager Pitch */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400">Hiring Manager Direct Pitch</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(aiMessages.hiringManager!, 'hm')}
                          className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white"
                        >
                          {copiedKey === 'hm' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        {aiMessages.hiringManager}
                      </p>
                    </div>

                    {/* Peer Connection */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400">Peer Engineering Chat</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(aiMessages.peer!, 'peer')}
                          className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white"
                        >
                          {copiedKey === 'peer' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        {aiMessages.peer}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
