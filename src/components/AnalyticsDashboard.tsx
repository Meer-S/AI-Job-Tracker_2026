import React, { useMemo } from 'react';
import { Job } from '../types/job';
import { 
  TrendingUp, 
  Briefcase, 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  Zap, 
  Layers,
  Award
} from 'lucide-react';

interface AnalyticsDashboardProps {
  jobs: Job[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ jobs }) => {
  const now = new Date();
  
  // Calculate key performance metrics
  const metrics = useMemo(() => {
    const totalCount = jobs.length;
    
    // Applications in last 7 and 30 days
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const appsThisWeek = jobs.filter(j => new Date(j.appliedDate) >= sevenDaysAgo).length;
    const appsThisMonth = jobs.filter(j => new Date(j.appliedDate) >= thirtyDaysAgo).length;

    // Interview Conversion Rate = (interviewing + offered) / (total non-bookmarked applications)
    const activePipeline = jobs.filter(j => j.status !== 'bookmarked');
    const interviewCount = jobs.filter(j => ['interviewing', 'offered'].includes(j.status)).length;
    const conversionRate = activePipeline.length > 0 
      ? Math.round((interviewCount / activePipeline.length) * 100) 
      : 0;

    // Pipeline Value (Sum of base salaries for active applications)
    const pipelineValueSum = jobs
      .filter(j => ['applied', 'screening', 'interviewing', 'offered'].includes(j.status))
      .reduce((sum, j) => sum + (j.financials?.baseSalary || 0), 0);

    // Tech Stack Frequencies
    const stackCounts: Record<string, number> = {};
    jobs.forEach(j => {
      j.techStack.forEach(t => {
        stackCounts[t] = (stackCounts[t] || 0) + 1;
      });
    });
    const sortedTech = Object.entries(stackCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      totalCount,
      appsThisWeek,
      appsThisMonth,
      conversionRate,
      pipelineValueSum,
      sortedTech,
    };
  }, [jobs]);

  // Generate 52-week GitHub-style heatmap dataset
  const heatmapData = useMemo(() => {
    // Generate dates for the last 120 days (approx 16 weeks) for crisp display
    const days: { dateStr: string; count: number; level: number }[] = [];
    const today = new Date();
    
    // Map job application counts by date YYYY-MM-DD
    const dateCounts: Record<string, number> = {};
    jobs.forEach(j => {
      const d = j.appliedDate;
      if (d) {
        dateCounts[d] = (dateCounts[d] || 0) + 1;
      }
    });

    for (let i = 119; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      const count = dateCounts[dateStr] || 0;
      let level = 0;
      if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count >= 3) level = 3;

      days.push({ dateStr, count, level });
    }

    return days;
  }, [jobs]);

  return (
    <div className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          
          {/* Card 1: Velocity */}
          <div className="p-4 rounded-xl glass-card border border-indigo-500/20 bg-slate-900/60 relative overflow-hidden">
            <div className="absolute right-3 top-3 p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Velocity</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">{metrics.appsThisWeek}</span>
              <span className="text-xs text-indigo-400 font-medium">{metrics.appsThisMonth} this month</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Applications logged</p>
          </div>

          {/* Card 2: Conversion Rate */}
          <div className="p-4 rounded-xl glass-card border border-emerald-500/20 bg-slate-900/60 relative overflow-hidden">
            <div className="absolute right-3 top-3 p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Interview Rate</p>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white">{metrics.conversionRate}%</span>
              <span className="text-xs text-emerald-400 font-medium">Conversion</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Screening to Interview ratio</p>
          </div>

          {/* Card 3: Pipeline Value */}
          <div className="p-4 rounded-xl glass-card border border-cyan-500/20 bg-slate-900/60 relative overflow-hidden">
            <div className="absolute right-3 top-3 p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Pipeline Value</p>
            <div className="mt-2 flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-white">
                ${(metrics.pipelineValueSum / 1000).toFixed(0)}k
              </span>
              <span className="text-xs text-cyan-400 font-medium">USD</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Total active salary potential</p>
          </div>

          {/* Card 4: Top Tech Stacks */}
          <div className="p-4 rounded-xl glass-card border border-purple-500/20 bg-slate-900/60 relative overflow-hidden">
            <div className="absolute right-3 top-3 p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Top Tech Demand</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {metrics.sortedTech.slice(0, 4).map(([tech, count]) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-purple-300 border border-purple-500/20"
                >
                  {tech} ({count})
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">Most targeted competencies</p>
          </div>

        </div>

        {/* GitHub-Style Activity Heatmap */}
        <div className="p-4 rounded-xl glass-panel bg-slate-950/70">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Application Activity Heatmap (Last 120 Days)
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <span>Less</span>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span>
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-900/80"></span>
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span>
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span>
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Grid representation */}
          <div className="overflow-x-auto pb-1">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[640px]">
              {heatmapData.map((d) => {
                let colorClass = 'bg-slate-800/80 hover:border-slate-600';
                if (d.level === 1) colorClass = 'bg-indigo-900/90 border border-indigo-700/50';
                else if (d.level === 2) colorClass = 'bg-indigo-600 shadow-sm shadow-indigo-500/50';
                else if (d.level === 3) colorClass = 'bg-cyan-400 shadow-md shadow-cyan-400/50';

                return (
                  <div
                    key={d.dateStr}
                    title={`${d.dateStr}: ${d.count} applications submitted`}
                    className={`w-3.5 h-3.5 rounded-xs transition-all duration-150 transform hover:scale-125 cursor-pointer ${colorClass}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
