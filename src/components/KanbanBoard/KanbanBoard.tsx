import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { BoardColumn, Job, JobStatus } from '../../types/job';
import { KanbanColumn } from './KanbanColumn';
import { JobCard } from './JobCard';

interface KanbanBoardProps {
  jobs: Job[];
  onUpdateJobStatus: (jobId: string, newStatus: JobStatus) => void;
  onOpenDetail: (job: Job) => void;
  onAddNewInColumn: (status: JobStatus) => void;
}

const COLUMNS: BoardColumn[] = [
  {
    id: 'bookmarked',
    title: 'Wishlist / Saved',
    color: 'bg-slate-400',
    badgeBg: 'bg-slate-800 text-slate-300 border border-slate-700',
    iconName: 'Bookmark',
  },
  {
    id: 'applied',
    title: 'Applied',
    color: 'bg-blue-500',
    badgeBg: 'bg-blue-950/80 text-blue-300 border border-blue-800',
    iconName: 'Send',
  },
  {
    id: 'screening',
    title: 'Screening / OA',
    color: 'bg-amber-500',
    badgeBg: 'bg-amber-950/80 text-amber-300 border border-amber-800',
    iconName: 'Code',
  },
  {
    id: 'interviewing',
    title: 'Interviewing',
    color: 'bg-purple-500',
    badgeBg: 'bg-purple-950/80 text-purple-300 border border-purple-800',
    iconName: 'Users',
  },
  {
    id: 'offered',
    title: 'Offer Received',
    color: 'bg-emerald-400',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800',
    iconName: 'Trophy',
  },
  {
    id: 'rejected',
    title: 'Closed / Rejected',
    color: 'bg-rose-500',
    badgeBg: 'bg-rose-950/80 text-rose-300 border border-rose-800',
    iconName: 'XCircle',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  jobs,
  onUpdateJobStatus,
  onOpenDetail,
  onAddNewInColumn,
}) => {
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const found = jobs.find((j) => j.id === active.id);
    if (found) {
      setActiveJob(found);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Determine target column status
    let targetStatus: JobStatus | undefined;

    // Is target a column ID?
    const isColumn = COLUMNS.some((c) => c.id === overId);
    if (isColumn) {
      targetStatus = overId as JobStatus;
    } else {
      // Target is another job card -> find its status
      const overJob = jobs.find((j) => j.id === overId);
      if (overJob) {
        targetStatus = overJob.status;
      }
    }

    if (targetStatus) {
      const currentJob = jobs.find((j) => j.id === activeId);
      if (currentJob && currentJob.status !== targetStatus) {
        onUpdateJobStatus(activeId, targetStatus);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-4 overflow-x-auto pb-6 pt-2 items-start px-2 min-h-[calc(100vh-140px)]">
        {COLUMNS.map((column) => {
          const columnJobs = jobs.filter((j) => j.status === column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              jobs={columnJobs}
              onOpenDetail={onOpenDetail}
              onAddNewInColumn={onAddNewInColumn}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeJob ? <JobCard job={activeJob} onOpenDetail={() => {}} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};
