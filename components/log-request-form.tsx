"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { supabase, type TaskType, type TaskAsk, type TaskRecipient, type ContributorProfile } from "@/lib/supabase"

const typeOptions: TaskType[] = ["Task", "Service", "Role"]
const askOptions: TaskAsk[] = ["< 1 hour", "1–3 hours", "3+ hours", "Weekend camping"]
const recipientOptions: TaskRecipient[] = [
  "Scoutmaster / ASMs",
  "Committee Chair",
  "Treasurer",
  "Summer Camp Coordinator",
  "Popcorn Colonel",
  "Other (see Notes)",
]
const profileOptions: ContributorProfile[] = [
  "Committee Member / Parent",
  "ASM",
  "Youth",
  "Role-specific (see Notes)",
]

interface LogRequestFormProps {
  onSuccess: () => void
}

type FormErrors = {
  title?: string
  type?: string
  ask?: string
  recipient?: string
  commitmentDate?: string
  contributorProfile?: string
}

export function LogRequestForm({ onSuccess }: LogRequestFormProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<TaskType | "">("")
  const [ask, setAsk] = useState<TaskAsk | "">("")
  const [recipient, setRecipient] = useState<TaskRecipient | "">("")
  const [commitmentDate, setCommitmentDate] = useState<Date | undefined>()
  const [executionDate, setExecutionDate] = useState<Date | undefined>()
  const [contributorProfile, setContributorProfile] = useState<ContributorProfile | "">("")
  const [notes, setNotes] = useState("")
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!title.trim()) newErrors.title = "Task / Item is required"
    if (!type) newErrors.type = "Type is required"
    if (!ask) newErrors.ask = "Ask / Time Commitment is required"
    if (!recipient) newErrors.recipient = "Recipient is required"
    if (!commitmentDate) newErrors.commitmentDate = "Commitment Date is required"
    if (!contributorProfile) newErrors.contributorProfile = "Contributor Profile is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setTitle("")
    setType("")
    setAsk("")
    setRecipient("")
    setCommitmentDate(undefined)
    setExecutionDate(undefined)
    setContributorProfile("")
    setNotes("")
    setErrors({})
    setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const { error } = await supabase
        .from("t221_volunteer_tasks")
        .insert({
          title: title.trim(),
          type,
          ask,
          recipient,
          commitment_date: commitmentDate?.toISOString().split("T")[0],
          execution_date: executionDate?.toISOString().split("T")[0] || null,
          contributor_profile: contributorProfile,
          notes: notes.trim(),
          status: "Open",
          assigned_to: "",
          claim_notes: "",
        })

      if (error) throw error

      setShowSuccess(true)
      resetForm()
      
      setTimeout(() => {
        setShowSuccess(false)
        onSuccess()
      }, 1500)
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Task logged</h3>
        <p className="text-muted-foreground">
          It&apos;s now live for contributors to claim.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">
            Task / Item <span className="text-[#BF0000]">*</span>
          </FieldLabel>
          <Input
            id="title"
            placeholder="What do you need help with?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
            }}
            className={cn(errors.title && "border-[#BF0000]")}
            disabled={isSubmitting}
          />
          {errors.title && <p className="text-sm text-[#BF0000] mt-1">{errors.title}</p>}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>
              Type <span className="text-[#BF0000]">*</span>
            </FieldLabel>
            <Select
              value={type}
              onValueChange={(v) => {
                setType(v as TaskType)
                if (errors.type) setErrors((prev) => ({ ...prev, type: undefined }))
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger className={cn(errors.type && "border-[#BF0000]")}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-[#BF0000] mt-1">{errors.type}</p>}
          </Field>

          <Field>
            <FieldLabel>
              Ask / Time Commitment <span className="text-[#BF0000]">*</span>
            </FieldLabel>
            <Select
              value={ask}
              onValueChange={(v) => {
                setAsk(v as TaskAsk)
                if (errors.ask) setErrors((prev) => ({ ...prev, ask: undefined }))
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger className={cn(errors.ask && "border-[#BF0000]")}>
                <SelectValue placeholder="Select time commitment" />
              </SelectTrigger>
              <SelectContent>
                {askOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ask && <p className="text-sm text-[#BF0000] mt-1">{errors.ask}</p>}
          </Field>
        </div>

        <Field>
          <FieldLabel>
            Recipient <span className="text-[#BF0000]">*</span>
          </FieldLabel>
          <Select
            value={recipient}
            onValueChange={(v) => {
              setRecipient(v as TaskRecipient)
              if (errors.recipient) setErrors((prev) => ({ ...prev, recipient: undefined }))
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger className={cn(errors.recipient && "border-[#BF0000]")}>
              <SelectValue placeholder="Who is this request from?" />
            </SelectTrigger>
            <SelectContent>
              {recipientOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.recipient && <p className="text-sm text-[#BF0000] mt-1">{errors.recipient}</p>}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>
              Commitment Date <span className="text-[#BF0000]">*</span>
            </FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !commitmentDate && "text-muted-foreground",
                    errors.commitmentDate && "border-[#BF0000]"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {commitmentDate ? format(commitmentDate, "MMM d, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={commitmentDate}
                  onSelect={(date) => {
                    setCommitmentDate(date)
                    if (errors.commitmentDate) setErrors((prev) => ({ ...prev, commitmentDate: undefined }))
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.commitmentDate && <p className="text-sm text-[#BF0000] mt-1">{errors.commitmentDate}</p>}
          </Field>

          <Field>
            <FieldLabel>Execution Date</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !executionDate && "text-muted-foreground"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {executionDate ? format(executionDate, "MMM d, yyyy") : "Select date (optional)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={executionDate}
                  onSelect={setExecutionDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </Field>
        </div>

        <Field>
          <FieldLabel>
            Contributor Profile <span className="text-[#BF0000]">*</span>
          </FieldLabel>
          <Select
            value={contributorProfile}
            onValueChange={(v) => {
              setContributorProfile(v as ContributorProfile)
              if (errors.contributorProfile) setErrors((prev) => ({ ...prev, contributorProfile: undefined }))
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger className={cn(errors.contributorProfile && "border-[#BF0000]")}>
              <SelectValue placeholder="Who should do this task?" />
            </SelectTrigger>
            <SelectContent>
              {profileOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.contributorProfile && <p className="text-sm text-[#BF0000] mt-1">{errors.contributorProfile}</p>}
        </Field>

        <Field>
          <FieldLabel>Notes</FieldLabel>
          <Textarea
            placeholder="Add any additional details, instructions, or context..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSubmitting}
            rows={4}
          />
        </Field>
      </FieldGroup>

      {submitError && (
        <p className="text-sm text-[#BF0000] text-center">{submitError}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#BF0000] hover:bg-[#A00000] text-white text-base"
      >
        {isSubmitting ? (
          <>
            <Spinner className="h-5 w-5 mr-2" />
            Submitting...
          </>
        ) : (
          "Submit Request"
        )}
      </Button>
    </form>
  )
}
