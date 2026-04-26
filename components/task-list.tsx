"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase, sampleTasks, type Task } from "@/lib/supabase"
import { TaskCard } from "@/components/task-card"
import { TaskTable } from "@/components/task-table"
import { TaskFilterBar, type Filters } from "@/components/task-filter-bar"
import { ClaimModal } from "@/components/claim-modal"
import { ClaimToast } from "@/components/claim-toast"
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

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [usingSampleData, setUsingSampleData] = useState(false)
  
  // Claim modal state
  const [claimTask, setClaimTask] = useState<Task | null>(null)
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  
  // Toast state
  const [toastData, setToastData] = useState<{ name: string; taskTitle: string } | null>(null)
  const [toastVisible, setToastVisible] = useState(false)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    setUsingSampleData(false)
    
    try {
      const { data, error: fetchError } = await supabase
        .from("t221_volunteer_tasks")
        .select("*")
        .order("commitment_date", { ascending: true })
      
      if (fetchError) {
        console.log("[v0] Supabase error, using sample data:", fetchError.message)
        setTasks(sampleTasks)
        setUsingSampleData(true)
      } else if (data && data.length > 0) {
        setTasks(data as Task[])
      } else {
        setTasks(sampleTasks)
        setUsingSampleData(true)
      }
    } catch (err) {
      console.log("[v0] Fetch error, using sample data:", err)
      setTasks(sampleTasks)
      setUsingSampleData(true)
    }
    
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleClaimClick = (task: Task) => {
    setClaimTask(task)
    setClaimModalOpen(true)
  }

  const handleClaimConfirm = async (taskId: string, name: string, claimNotes: string) => {
    if (usingSampleData) {
      // For sample data, just update local state
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, assigned_to: name, claim_notes: claimNotes, status: "Claimed" as const, claimed_at: new Date().toISOString() }
          : t
      ))
    } else {
      // Update via Supabase
      const { error: updateError } = await supabase
        .from("t221_volunteer_tasks")
        .update({
          assigned_to: name,
          claim_notes: claimNotes,
          status: "Claimed",
          claimed_at: new Date().toISOString(),
        })
        .eq("id", taskId)

      if (updateError) {
        throw new Error(updateError.message)
      }

      // Re-fetch to get live state
      await fetchTasks()
    }

    // Show success toast
    const taskTitle = claimTask?.title || ""
    setToastData({ name, taskTitle })
    setToastVisible(true)
    
    // Close modal
    setClaimModalOpen(false)
    setClaimTask(null)
  }

  // Apply filters
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
      {/* Filter bar */}
      <TaskFilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchTasks}
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
      ) : error ? (
        <Empty>
          <EmptyTitle>Failed to load tasks</EmptyTitle>
          <EmptyDescription>{error}</EmptyDescription>
          <Button 
            variant="outline" 
            onClick={fetchTasks} 
            className="mt-4"
          >
            Try Again
          </Button>
        </Empty>
      ) : filteredTasks.length === 0 ? (
        <Empty>
          <ClipboardList className="h-10 w-10 text-muted-foreground" />
          <EmptyTitle>No tasks found</EmptyTitle>
          <EmptyDescription>
            No tasks match the current filters.
          </EmptyDescription>
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
                onClaimClick={() => handleClaimClick(task)}
              />
            ))}
          </div>
          
          {/* Desktop: Table view */}
          <div className="hidden lg:block">
            <TaskTable 
              tasks={filteredTasks} 
              onClaimClick={handleClaimClick}
            />
          </div>
        </>
      )}

      {/* Claim modal */}
      <ClaimModal
        task={claimTask}
        open={claimModalOpen}
        onOpenChange={setClaimModalOpen}
        onConfirm={handleClaimConfirm}
      />

      {/* Success toast */}
      <ClaimToast
        name={toastData?.name || ""}
        taskTitle={toastData?.taskTitle || ""}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  )
}
