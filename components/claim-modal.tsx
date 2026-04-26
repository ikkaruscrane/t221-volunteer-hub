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

interface ClaimModalProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (taskId: string, name: string, notes: string) => Promise<void>
}

export function ClaimModal({ task, open, onOpenChange, onConfirm }: ClaimModalProps) {
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const handleConfirm = async () => {
    if (!task) return
    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await onConfirm(task.id, name.trim(), notes.trim())
      setName("")
      setNotes("")
    } catch (err) {
      setError("Failed to claim task. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setName("")
      setNotes("")
      setError(null)
      onOpenChange(false)
    }
  }

  const formContent = (
    <div className="space-y-4 py-4 px-1">
      <Field>
        <FieldLabel htmlFor="claimer-name">
          Your name <span className="text-[#BF0000]">*</span>
        </FieldLabel>
        <Input
          id="claimer-name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          className={`h-12 ${error && !name.trim() ? "border-[#BF0000]" : ""}`}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="claim-notes">
          Notes or questions for the recipient
        </FieldLabel>
        <Textarea
          id="claim-notes"
          placeholder="Optional: Add any notes or questions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
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
            Claiming...
          </>
        ) : (
          "Confirm"
        )}
      </Button>
    </>
  )

  // Use Drawer on mobile for bottom sheet feel
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Claim This Task</DrawerTitle>
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
          <DialogTitle>Claim This Task</DialogTitle>
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
