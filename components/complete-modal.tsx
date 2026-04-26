"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Task } from "@/lib/supabase"

interface CompleteModalProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (taskId: string, completedBy: string, completionNotes: string) => Promise<void>
}

export function CompleteModal({ task, open, onOpenChange, onConfirm }: CompleteModalProps) {
  const [completedBy, setCompletedBy] = useState("")
  const [completionNotes, setCompletionNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const handleConfirm = async () => {
    if (!task) return
    if (!completedBy.trim()) {
      setError("Please enter your name")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await onConfirm(task.id, completedBy.trim(), completionNotes.trim())
      setCompletedBy("")
      setCompletionNotes("")
    } catch (err) {
      setError("Failed to mark task complete. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setCompletedBy("")
      setCompletionNotes("")
      setError(null)
      onOpenChange(false)
    }
  }

  const formContent = (
    <div className="space-y-4 py-4 px-1">
      <Field>
        <FieldLabel htmlFor="completed-by">
          Completed by <span className="text-[#BF0000]">*</span>
        </FieldLabel>
        <Input
          id="completed-by"
          placeholder="Enter your name"
          value={completedBy}
          onChange={(e) => setCompletedBy(e.target.value)}
          disabled={isSubmitting}
          className={`h-12 ${error && !completedBy.trim() ? "border-[#BF0000]" : ""}`}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="completion-notes">
          Notes
        </FieldLabel>
        <Textarea
          id="completion-notes"
          placeholder="Optional: Any notes about how this was completed..."
          value={completionNotes}
          onChange={(e) => setCompletionNotes(e.target.value)}
          disabled={isSubmitting}
          rows={3}
        />
      </Field>

      {error && (
        <p className="text-sm text-[#BF0000]">{error}</p>
      )}
    </div>
  )

  const footerButtons = (
    <>
      <Button
        variant="outline"
        onClick={handleClose}
        disabled={isSubmitting}
        className="w-full sm:w-auto min-h-[44px]"
      >
        Cancel
      </Button>
      <Button
        onClick={handleConfirm}
        disabled={isSubmitting}
        className="w-full sm:w-auto min-h-[44px] bg-[#BF0000] hover:bg-[#A00000] text-white"
      >
        {isSubmitting ? (
          <>
            <Spinner className="h-4 w-4 mr-2" />
            Saving...
          </>
        ) : (
          "Mark Complete"
        )}
      </Button>
    </>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Mark Task Complete</DrawerTitle>
            {task && (
              <DrawerDescription className="text-base font-semibold text-foreground pt-2">
                {task.title}
              </DrawerDescription>
            )}
          </DrawerHeader>
          <div className="px-4">
            {formContent}
          </div>
          <DrawerFooter className="flex-col gap-2">
            {footerButtons}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Task Complete</DialogTitle>
          {task && (
            <DialogDescription className="text-base font-semibold text-foreground pt-2">
              {task.title}
            </DialogDescription>
          )}
        </DialogHeader>
        {formContent}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {footerButtons}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
