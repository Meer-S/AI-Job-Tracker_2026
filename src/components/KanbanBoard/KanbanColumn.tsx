import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BoardColumn, Job } from '../../types/job';
import { JobCard } from './JobCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  column: BoardColumn;
  jobs: Job[];
  onOpenDetail: (job: Job) => void;
  onAddNewInColumn: (status: BoardColumn['id']) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  jobs,
  onOpenDetail,
  onAddNewInColumn,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col w-80 flex-shrink-0 bg-slate-950/60 rounded-2xl border border-slate-800/80 p-3 max-h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {column.title}
          </h3>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${column.badgeBg}`}
          >
            {jobs.length}
          </span>
        </div>

        <button
          onClick={() => onAddNewInColumn(column.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={`Add job to ${column.title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Container with SortableContext */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto space-y-3 min-h-[300px] p-1 rounded-xl transition-colors ${
          isOver ? 'bg-indigo-950/20 ring-2 ring-indigo-500/30 ring-dashed' : ''
        }`}
      >
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onOpenDetail={onOpenDetail} />
          ))}
        </SortableContext>

        {jobs.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-800/80 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 font-medium">No applications</p>
            <button
              onClick={() => onAddNewInColumn(column.id)}
              className="mt-2 text-xs text-indigo-400 hover:underline"
            >
              + Add first job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
