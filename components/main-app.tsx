"use client"

import { useState, useCallback, useEffect } from "react"
import { supabase, sampleTasks, type Task } from "@/lib/supabase"
import { TaskList } from "@/components/task-list"
import { CompletedList } from "@/components/completed-list"
import { LogRequestForm } from "@/components/log-request-form"
import { TroopLogo } from "@/components/troop-logo"
import { Button } from "@/components/ui/button"
import { ClaimModal } from "@/components/claim-modal"
import { CompleteModal } from "@/components/complete-modal"
import { ClaimToast } from "@/components/claim-toast"
import { TaskDetailModal } from "@/components/task-detail-modal"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "tasks" | "completed" | "log"

interface MainAppProps {
  onLogout: () => void
}

export function MainApp({ onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>("tasks")

  // Shared task state — drives both Tasks and Completed tabs
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [usingSampleData, setUsingSampleData] = useState(false)

  // Detail modal
  const [detailTask, setDetailTask] = useState<Task | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Claim modal
  const [claimTask, setClaimTask] = useState<Task | null>(null)
  const [claimModalOpen, setClaimModalOpen] = useState(false)

  // Complete modal
  const [completeTask, setCompleteTask] = useState<Task | null>(null)
  const [completeModalOpen, setCompleteModalOpen] = useState(false)

  // Toast
  const [toastData, setToastData] = useState<{ name: string; taskTitle: string } | null>(null)
  const [toastVisible, setToastVisible] = useState(false)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setUsingSampleData(false)

    try {
      const { data, error: fetchError } = await supabase
        .from("t221_volunteer_tasks")
        .select("*")
        .order("commitment_date", { ascending: true })

      if (fetchError) {
        setTasks(sampleTasks)
        setUsingSampleData(true)
      } else if (data && data.length > 0) {
        setTasks(data as Task[])
      } else {
        setTasks(sampleTasks)
        setUsingSampleData(true)
      }
    } catch {
      setTasks(sampleTasks)
      setUsingSampleData(true)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleDetailClick = (task: Task) => {
    setDetailTask(task)
    setDetailOpen(true)
  }

  const handleClaimClick = (task: Task) => {
    setDetailOpen(false)
    setClaimTask(task)
    setClaimModalOpen(true)
  }

  const handleCompleteClick = (task: Task) => {
    setDetailOpen(false)
    setCompleteTask(task)
    setCompleteModalOpen(true)
  }

  const handleClaimConfirm = async (taskId: string, name: string, claimNotes: string) => {
    if (usingSampleData) {
      setTasks(prev => prev.map(t =>
        t.id === taskId
          ? { ...t, assigned_to: name, claim_notes: claimNotes, status: "Claimed" as const, claimed_at: new Date().toISOString() }
          : t
      ))
    } else {
      const { error: updateError } = await supabase
        .from("t221_volunteer_tasks")
        .update({ assigned_to: name, claim_notes: claimNotes, status: "Claimed", claimed_at: new Date().toISOString() })
        .eq("id", taskId)

      if (updateError) throw new Error(updateError.message)
      await fetchTasks()
    }

    setToastData({ name, taskTitle: claimTask?.title || "" })
    setToastVisible(true)
    setClaimModalOpen(false)
    setClaimTask(null)
  }

  const handleCompleteConfirm = async (taskId: string, completedBy: string, completionNotes: string) => {
    if (usingSampleData) {
      setTasks(prev => prev.map(t =>
        t.id === taskId
          ? { ...t, completed_by: completedBy, completion_notes: completionNotes, status: "Complete" as const, completed_at: new Date().toISOString() }
          : t
      ))
    } else {
      const { error: updateError } = await supabase
        .from("t221_volunteer_tasks")
        .update({ completed_by: completedBy, completion_notes: completionNotes, status: "Complete", completed_at: new Date().toISOString() })
        .eq("id", taskId)

      if (updateError) throw new Error(updateError.message)
      await fetchTasks()
    }

    setCompleteModalOpen(false)
    setCompleteTask(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("t221_auth")
    onLogout()
  }

  const handleLogSuccess = () => {
    setActiveTab("tasks")
    fetchTasks()
  }

  const activeTasks = tasks.filter(t => t.status !== "Complete")
  const completedTasks = tasks.filter(t => t.status === "Complete")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TroopLogo className="h-12 w-auto sm:h-14" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#BF0000]">
                  Volunteer Hub
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Character | Adventure | Leadership
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px]"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Exit</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="container mx-auto px-4">
          <nav className="flex border-b-0" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === "tasks"}
              onClick={() => setActiveTab("tasks")}
              className={cn(
                "flex-1 sm:flex-none px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-colors min-h-[44px]",
                "border-b-2 -mb-px",
                activeTab === "tasks"
                  ? "border-[#BF0000] text-[#BF0000]"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              Tasks
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "completed"}
              onClick={() => setActiveTab("completed")}
              className={cn(
                "flex-1 sm:flex-none px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-colors min-h-[44px]",
                "border-b-2 -mb-px",
                activeTab === "completed"
                  ? "border-[#BF0000] text-[#BF0000]"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              Completed
              {completedTasks.length > 0 && (
                <span className="ml-1.5 text-xs bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5">
                  {completedTasks.length}
                </span>
              )}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "log"}
              onClick={() => setActiveTab("log")}
              className={cn(
                "flex-1 sm:flex-none px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-colors min-h-[44px]",
                "border-b-2 -mb-px",
                activeTab === "log"
                  ? "border-[#BF0000] text-[#BF0000]"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              Log a Request
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {activeTab === "tasks" ? (
          <TaskList
            tasks={activeTasks}
            loading={loading}
            usingSampleData={usingSampleData}
            onRefresh={fetchTasks}
            onDetailClick={handleDetailClick}
          />
        ) : activeTab === "completed" ? (
          <CompletedList
            tasks={completedTasks}
            loading={loading}
            onDetailClick={handleDetailClick}
          />
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">Log a New Request</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Submit a volunteer need for the troop. Once logged, it will be visible for contributors to claim.
              </p>
            </div>
            <LogRequestForm onSuccess={handleLogSuccess} />
          </div>
        )}
      </main>

      <footer className="border-t py-4">
        <p className="text-center text-sm text-muted-foreground">
          TROOP 221 · Plano, Texas · t221.org
        </p>
      </footer>

      {/* Detail modal */}
      <TaskDetailModal
        task={detailTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onClaimClick={handleClaimClick}
        onCompleteClick={handleCompleteClick}
      />

      {/* Claim modal */}
      <ClaimModal
        task={claimTask}
        open={claimModalOpen}
        onOpenChange={setClaimModalOpen}
        onConfirm={handleClaimConfirm}
      />

      {/* Complete modal */}
      <CompleteModal
        task={completeTask}
        open={completeModalOpen}
        onOpenChange={setCompleteModalOpen}
        onConfirm={handleCompleteConfirm}
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
