"use client"

import { useState } from "react"
import { type Task } from "@/lib/supabase"
import { TaskCard } from "@/components/task-card"
import { TaskTable } from "@/components/task-table"
import { TaskFilterBar, type Filters } from "@/components/task-filter-bar"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { RefreshCw, ClipboardList } from "lucide-react"

function isUrgent(commitmentDate: string | null, assignedTo: string): boolean {
  if (!commitmentDate || assignedTo) return false
  const commitment = new Date(commitmentDate)
  const now = new Date()
  const diffDays = Math.ceil((commitment.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 14
}

const defaultFilters: Filters = {
  type: "all",
  ask: "all",
  recipient: "all",
  contributorProfile: "all",
  status: "all",
  urgentOnly: false,
}

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  usingSampleData: boolean
  onRefresh: () => void
  onDetailClick: (task: Task) => void
}

export function TaskList({ tasks, loading, usingSampleData, onRefresh, onDetailClick }: TaskListProps) {
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  const filteredTasks = tasks.filter(task => {
    if (filters.type !== "all" && task.type !== filters.type) return false
    if (filters.ask !== "all" && task.ask !== filters.ask) return false
    if (filters.recipient !== "all" && task.recipient !== filters.recipient) return false
    if (filters.contributorProfile !== "all" && task.contributor_profile !== filters.contributorProfile) return false
    if (filters.status !== "all" && task.status !== filters.status) return false
    if (filters.urgentOnly && !(isUrgent(task.commitment_date, task.assigned_to) && task.status === "Open")) return false
    return true
  })

  return (
    <div className="space-y-4">
      <TaskFilterBar filters={filters} onFiltersChange={setFilters} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {usingSampleData && (
        <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
          Showing sample data. Connect your Supabase table to see real tasks.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8 text-[#BF0000]" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <Empty>
          <ClipboardList className="h-10 w-10 text-muted-foreground" />
          <EmptyTitle>No tasks found</EmptyTitle>
          <EmptyDescription>No tasks match the current filters.</EmptyDescription>
          <Button
            variant="outline"
            onClick={() => setFilters(defaultFilters)}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </Empty>
      ) : (
        <>
          {/* Mobile: Card view */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onDetailClick(task)}
              />
            ))}
          </div>

          {/* Desktop: Table view */}
          <div className="hidden lg:block">
            <TaskTable
              tasks={filteredTasks}
              onRowClick={onDetailClick}
            />
          </div>
        </>
      )}
    </div>
  )
}
