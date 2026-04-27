"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Task } from "@/lib/supabase"
import { CalendarDays, User, Clock, Users } from "lucide-react"

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function isUrgent(commitmentDate: string | null, assignedTo: string): boolean {
  if (!commitmentDate || assignedTo) return false
  const commitment = new Date(commitmentDate)
  const now = new Date()
  const diffDays = Math.ceil((commitment.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 14
}

const statusBadgeStyles: Record<Task["status"], string> = {
  Open: "bg-muted text-muted-foreground border-border",
  Claimed: "bg-green-100 text-green-800 border-green-200",
  Complete: "bg-blue-100 text-blue-800 border-blue-200",
  Cancelled: "bg-muted text-muted-foreground border-border line-through",
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

export function TaskCard({ task, onClick }: TaskCardProps) {
  const isClaimed = task.status === "Claimed"
  const urgent = isUrgent(task.commitment_date, task.assigned_to) && task.status === "Open"

  return (
    <Card
      onClick={onClick}
      className={`hover:shadow-md transition-shadow cursor-pointer ${isClaimed ? "opacity-75" : ""}`}
    >
      <CardHeader className="pb-2 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <h3
              className={`text-base leading-tight ${
                urgent
                  ? "font-bold text-[#BF0000]"
                  : isClaimed
                    ? "italic text-muted-foreground font-normal"
                    : "font-semibold text-foreground"
              }`}
            >
              {task.title}
            </h3>
            {task.assigned_to && (
              <p className="text-xs italic text-muted-foreground">
                Claimed by {task.assigned_to}
              </p>
            )}
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 ${statusBadgeStyles[task.status]}`}
          >
            {task.status}
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
        <div className="grid gap-1.5 text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{task.recipient}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>Commit: {formatDate(task.commitment_date)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{task.contributor_profile}</span>
          </div>
        </div>

        {task.status === "Open" && !task.assigned_to && (
          <p className="text-xs text-[#BF0000] font-medium">Tap to view & claim →</p>
        )}
      </CardContent>
    </Card>
  )
}
