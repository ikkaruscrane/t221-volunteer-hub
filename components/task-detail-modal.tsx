"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { type Task } from "@/lib/supabase"
import { CalendarDays, User, Clock, Users, FileText, ExternalLink, CheckCircle2 } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

function formatDate(dateString: string | null): string {
  if (!dateString) return "—"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function renderWithLinks(text: string) {
  if (!text) return <span className="text-muted-foreground italic">None</span>
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return (
    <>
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center gap-0.5 break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part} <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
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

interface TaskDetailModalProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClaimClick: (task: Task) => void
  onCompleteClick: (task: Task) => void
}

export function TaskDetailModal({ task, open, onOpenChange, onClaimClick, onCompleteClick }: TaskDetailModalProps) {
  const isMobile = useIsMobile()

  if (!task) return null

  const canClaim = task.status === "Open" && !task.assigned_to
  const canComplete = task.status === "Open" || task.status === "Claimed"

  const detailContent = (
    <div className="space-y-4 py-2">
      {/* Status + type badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={statusBadgeStyles[task.status]}>
          {task.status}
        </Badge>
        <Badge variant="outline" className={`text-xs ${typeBadgeStyles[task.type]}`}>
          {task.type}
        </Badge>
        <Badge variant="outline" className={`text-xs ${askBadgeStyles[task.ask]}`}>
          <Clock className="h-3 w-3 mr-1" />
          {task.ask}
        </Badge>
      </div>

      {/* Core details */}
      <div className="space-y-3 text-sm">
        <div className="flex gap-3">
          <User className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Recipient</p>
            <p>{task.recipient}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Users className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Contributor Profile</p>
            <p>{task.contributor_profile}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Dates</p>
            <p>Commit by: {formatDate(task.commitment_date)}</p>
            <p>Execute: {formatDate(task.execution_date)}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Notes</p>
            <p className="leading-relaxed">{renderWithLinks(task.notes)}</p>
          </div>
        </div>
      </div>

      {/* Claimed info */}
      {task.assigned_to && (
        <>
          <Separator />
          <div className="space-y-1 text-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Claimed By</p>
            <p className="font-medium text-green-800">{task.assigned_to}</p>
            {task.claim_notes && (
              <p className="text-muted-foreground italic">"{task.claim_notes}"</p>
            )}
          </div>
        </>
      )}

      {/* Completed info */}
      {task.status === "Complete" && (
        <>
          <Separator />
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-1.5 text-blue-700 mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Completed</p>
            </div>
            <p className="font-medium">{task.completed_by || "—"}</p>
            {task.completion_notes && (
              <p className="text-muted-foreground italic">"{task.completion_notes}"</p>
            )}
            <p className="text-xs text-muted-foreground">{formatDate(task.completed_at)}</p>
          </div>
        </>
      )}

      {/* Action buttons */}
      {(canClaim || canComplete) && (
        <>
          <Separator />
          <div className="flex flex-col gap-2">
            {canClaim && (
              <Button
                onClick={() => onClaimClick(task)}
                className="w-full min-h-[44px] bg-[#BF0000] hover:bg-[#A00000] text-white"
              >
                Claim This Task
              </Button>
            )}
            {canComplete && (
              <Button
                variant="outline"
                onClick={() => onCompleteClick(task)}
                className="w-full min-h-[44px] border-green-600 text-green-700 hover:bg-green-50"
              >
                Mark Complete
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-base leading-tight pr-2">{task.title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 overflow-y-auto max-h-[70vh]">
            {detailContent}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base leading-tight pr-6">{task.title}</DialogTitle>
        </DialogHeader>
        {detailContent}
      </DialogContent>
    </Dialog>
  )
}
