"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type Task } from "@/lib/supabase"
import { Clock } from "lucide-react"

interface TaskTableProps {
  tasks: Task[]
  onRowClick?: (task: Task) => void
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

export function TaskTable({ tasks, onRowClick }: TaskTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[280px]">Task</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Ask</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Commit</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const isClaimed = task.status === "Claimed"
            const urgent = isUrgent(task.commitment_date, task.assigned_to) && task.status === "Open"

            return (
              <TableRow
                key={task.id}
                onClick={() => onRowClick?.(task)}
                className={`cursor-pointer hover:bg-muted/50 ${isClaimed ? "opacity-75" : ""}`}
              >
                <TableCell>
                  <div className="space-y-0.5">
                    <span
                      className={`block ${
                        urgent
                          ? "font-bold text-[#BF0000]"
                          : isClaimed
                            ? "italic text-muted-foreground"
                            : "font-medium"
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.assigned_to && (
                      <span className="text-xs italic text-muted-foreground">
                        Claimed by {task.assigned_to}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${typeBadgeStyles[task.type]}`}>
                    {task.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs whitespace-nowrap ${askBadgeStyles[task.ask]}`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {task.ask}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {task.recipient}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {formatDate(task.commitment_date)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">
                  {task.contributor_profile}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusBadgeStyles[task.status]}>
                    {task.status}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
