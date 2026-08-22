import React, { useState } from 'react';
import { Job, JobStatus } from '../../types/job';
import { 
  ArrowUpDown, 
  ExternalLink, 
  Sparkles, 
  Trash2, 
  Edit3, 
  DollarSign, 
  UserCheck, 
  MapPin 
} from 'lucide-react';

interface JobTableProps {
  jobs: Job[];
  onOpenDetail: (job: Job) => void;
  onUpdateJobStatus: (jobId: string, newStatus: JobStatus) => void;
  onDeleteJob: (jobId: string) => void;
}

type SortField = 'company' | 'title' | 'status' | 'appliedDate' | 'baseSalary';
type SortOrder = 'asc' | 'desc';

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  onOpenDetail,
  onUpdateJobStatus,
  onDeleteJob,
}) => {
  const [sortField, setSortField] = useState<SortField>('appliedDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    let valA: any = a[sortField as keyof Job];
    let valB: any = b[sortField as keyof Job];

    if (sortField === 'baseSalary') {
      valA = a.financials?.baseSalary || 0;
      valB = b.financials?.baseSalary || 0;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'bookmarked':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'applied':
        return 'bg-blue-950/80 text-blue-400 border-blue-800';
      case 'screening':
        return 'bg-amber-950/80 text-amber-400 border-amber-800';
      case 'interviewing':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      case 'offered':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'rejected':
        return 'bg-rose-950/80 text-rose-400 border-rose-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th
                onClick={() => handleSort('company')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Company & Role</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Tech Stack Profiling</th>
              <th className="py-3.5 px-4">Work Mode</th>
              <th
                onClick={() => handleSort('baseSalary')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Financials</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('appliedDate')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Applied Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-medium">
            {sortedJobs.map((job) => (
              <tr
                key={job.id}
                className="hover:bg-slate-850/60 transition-colors group cursor-pointer"
                onClick={() => onOpenDetail(job)}
              >
                {/* Company & Role */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2">
                    <div>
                      <div className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {job.company}
                      </div>
                      <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{job.title}</span>
                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-500 hover:text-indigo-400"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status Dropdown */}
                <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={job.status}
                    onChange={(e) => onUpdateJobStatus(job.id, e.target.value as JobStatus)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${getStatusBadge(
                      job.status
                    )}`}
                  >
                    <option value="bookmarked">Wishlist</option>
                    <option value="applied">Applied</option>
                    <option value="screening">Screening / OA</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offer Received</option>
                    <option value="rejected">Rejected / Closed</option>
                  </select>
                </td>

                {/* Tech Stack Badges */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {job.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-indigo-300 border border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Work Mode */}
                <td className="py-3.5 px-4">
                  <span className="text-slate-300 font-medium">{job.workMode}</span>
                  {job.location && (
                    <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                      {job.location}
                    </div>
                  )}
                </td>

                {/* Financials */}
                <td className="py-3.5 px-4">
                  {job.financials?.salaryRange ? (
                    <div className="text-slate-200 font-medium">
                      {job.financials.salaryRange}
                    </div>
                  ) : job.financials?.baseSalary ? (
                    <div className="text-emerald-400 font-semibold">
                      ${(job.financials.baseSalary / 1000).toFixed(0)}k Base
                    </div>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>

                {/* Applied Date */}
                <td className="py-3.5 px-4 text-slate-400">
                  {job.appliedDate}
                  {job.referral?.name && (
                    <div className="text-[10px] text-indigo-400 flex items-center gap-1 mt-0.5">
                      <UserCheck className="w-2.5 h-2.5" />
                      {job.referral.name}
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onOpenDetail(job)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                      title="Edit job & open AI copilot"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${job.title} at ${job.company}"?`)) {
                          onDeleteJob(job.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete job"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}

            {sortedJobs.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No matching jobs found. Add a job card or adjust search filters!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
