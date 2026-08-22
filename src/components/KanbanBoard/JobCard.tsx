import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Job } from '../../types/job';
import { 
  ExternalLink, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Clock,
  UserCheck,
  CheckSquare
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  onOpenDetail: (job: Job) => void;
  isOverlay?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onOpenDetail, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  // WorkMode badge colors
  const getWorkModeBadge = (mode: string) => {
    switch (mode) {
      case 'Remote':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Hybrid':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Onsite':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  // Completed interview count
  const completedInterviews = job.interviewPipeline?.filter(i => i.completed).length || 0;
  const totalInterviews = job.interviewPipeline?.length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpenDetail(job)}
      className={`group relative p-4 rounded-xl glass-card transition-all cursor-grab active:cursor-grabbing border hover:scale-[1.01] ${
        isOverlay
          ? 'shadow-2xl border-indigo-500 bg-slate-900 ring-2 ring-indigo-500/50'
          : 'border-slate-800/80 hover:border-indigo-500/40 bg-slate-900/90'
      }`}
    >
      {/* Glow highlight for interviewing/offered status */}
      {job.status === 'interviewing' && (
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-amber-500 via-indigo-500 to-cyan-400 rounded-t-xl" />
      )}
      {job.status === 'offered' && (
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-t-xl" />
      )}

      {/* Header: Company & Title */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            {job.company}
          </h4>
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {job.title}
          </h3>
        </div>

        {/* External URL icon */}
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded text-slate-500 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
            title="Open job link"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Tech Stack Tags */}
      <div className="mt-2.5 flex flex-wrap gap-1">
        {job.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/90 text-indigo-300 border border-slate-700/60"
          >
            {tech}
          </span>
        ))}
        {job.techStack.length > 4 && (
          <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-medium">
            +{job.techStack.length - 4}
          </span>
        )}
      </div>

      {/* Meta Row: Work mode & Salary */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
        <span
          className={`px-2 py-0.5 rounded-full font-medium border ${getWorkModeBadge(
            job.workMode
          )}`}
        >
          {job.workMode}
        </span>

        {job.financials?.salaryRange ? (
          <span className="text-slate-300 font-medium flex items-center gap-0.5">
            <DollarSign className="w-3 h-3 text-emerald-400" />
            {job.financials.salaryRange}
          </span>
        ) : (
          <span className="text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.location ? job.location.split('/')[0] : 'Undisclosed'}
          </span>
        )}
      </div>

      {/* Secondary Meta Row: Referral or Interview status indicator */}
      {(job.referral?.name || totalInterviews > 0 || job.aiData?.parsedCompetencies) && (
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
          {job.referral?.name ? (
            <span className="flex items-center text-indigo-400 font-medium">
              <UserCheck className="w-3 h-3 mr-1 text-indigo-400" />
              Ref: {job.referral.name}
            </span>
          ) : totalInterviews > 0 ? (
            <span className="flex items-center text-slate-400">
              <CheckSquare className="w-3 h-3 mr-1 text-indigo-400" />
              Milestones: {completedInterviews}/{totalInterviews}
            </span>
          ) : (
            <span></span>
          )}

          {job.aiData?.parsedCompetencies && (
            <span className="inline-flex items-center text-cyan-400 font-medium">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Copilot
            </span>
          )}
        </div>
      )}

      {/* Applied Date Footer */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Applied: {job.appliedDate}
        </span>
        <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
          View details →
        </span>
      </div>
    </div>
  );
};
