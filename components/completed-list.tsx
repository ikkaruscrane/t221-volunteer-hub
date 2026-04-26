"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase, sampleTasks, type Task } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle2, RefreshCw, User, CalendarDays, Clock } from "lucide-react"

function formatDate(dateString: string | null): string {
  if (!dateString) return "—"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const typeBadgeStyles: Record<Task["type"], string> = {
  Task: "bg-slate-100 text-slate-700 border-slate-200",
  Service: "bg-amber-50 text-amber-700 border-amber-200",
  Role: "bg-indigo-50 text-indigo-700 border-indigo-200",
}

const askBadgeStyles: Record<Task["ask"], string> = {
  "< 1 hour": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "1–3 hours": "bg-sky-50 text-sky-700 border-sky-200",
  "3+ hours": "bg-orange-50 text-orange-700 border-orange-200",
  "Weekend camping": "bg-rose-50 text-rose-700 border-rose-200",
}

export function CompletedList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [usingSampleData, setUsingSampleData] = useState(false)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setUsingSampleData(false)

    try {
      const { data, error: fetchError } = await supabase
        .from("t221_volunteer_tasks")
        .select("*")
        .eq("status", "Complete")
        .order("completed_at", { ascending: false })

      if (fetchError) {
        const completed = sampleTasks.filter(t => t.status === "Complete")
        setTasks(completed)
        setUsingSampleData(true)
      } else if (data) {
        setTasks(data as Task[])
      } else {
        const completed = sampleTasks.filter(t => t.status === "Complete")
        setTasks(completed)
        setUsingSampleData(true)
      }
    } catch {
      const completed = sampleTasks.filter(t => t.status === "Complete")
      setTasks(completed)
      setUsingSampleData(true)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tasks.length} completed task{tasks.length !== 1 ? "s" : ""}
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
          Showing sample data. Connect your Supabase table to see real completed tasks.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8 text-[#BF0000]" />
        </div>
      ) : tasks.length === 0 ? (
        <Empty>
          <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
          <EmptyTitle>No completed tasks yet</EmptyTitle>
          <EmptyDescription>
            Tasks marked complete will be archived here.
          </EmptyDescription>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tasks.map(task => (
            <Card key={task.id} className="opacity-90 border-green-100 bg-green-50/30">
              <CardHeader className="pb-2 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-medium text-foreground leading-tight flex-1 min-w-0">
                    {task.title}
                  </h3>
                  <Badge variant="outline" className="shrink-0 bg-blue-100 text-blue-800 border-blue-200">
                    Complete
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className={`text-xs ${typeBadgeStyles[task.type]}`}>
                    {task.type}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${askBadgeStyles[task.ask]}`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {task.ask}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="text-muted-foreground space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{task.recipient}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                    <span>Commit: {formatDate(task.commitment_date)}</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-green-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-green-800 font-medium text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    Completed by {task.completed_by || "—"}
                  </div>
                  {task.completion_notes && (
                    <p className="text-xs text-muted-foreground pl-5 italic">
                      "{task.completion_notes}"
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground pl-5">
                    {formatDate(task.completed_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
