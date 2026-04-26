import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://hjzwiawtuwopunzluxbl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqendpYXd0dXdvcHVuemx1eGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzgxMDUsImV4cCI6MjA5MjgxNDEwNX0.quryx9iiJMb_hAHYY2ywUt2XEWQ7w_CWTVC0TuxhBgA'
)

export type TaskType = "Task" | "Service" | "Role"
export type TaskAsk = "< 1 hour" | "1–3 hours" | "3+ hours" | "Weekend camping"
export type TaskRecipient = 
  | "Scoutmaster / ASMs" 
  | "Committee Chair" 
  | "Treasurer" 
  | "Summer Camp Coordinator" 
  | "Popcorn Colonel" 
  | "Other (see Notes)"
export type ContributorProfile = 
  | "Committee Member / Parent" 
  | "ASM" 
  | "Youth" 
  | "Role-specific (see Notes)"
export type TaskStatus = "Open" | "Claimed" | "Complete" | "Cancelled"

export type Task = {
  id: string
  title: string
  type: TaskType
  ask: TaskAsk
  recipient: TaskRecipient
  commitment_date: string
  execution_date: string
  contributor_profile: ContributorProfile
  notes: string
  assigned_to: string
  claim_notes: string
  status: TaskStatus
  created_at: string
  claimed_at: string | null
  completed_by: string
  completion_notes: string
  completed_at: string | null
}

// Sample seed data for development/demo
export const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Buy trailer supplies (batteries, first aid refills)",
    type: "Task",
    ask: "1–3 hours",
    recipient: "Scoutmaster / ASMs",
    commitment_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    execution_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contributor_profile: "Committee Member / Parent",
    notes: "Receipt reimbursement from Treasurer. Budget: $150 max.",
    assigned_to: "",
    claim_notes: "",
    status: "Open",
    created_at: new Date().toISOString(),
    claimed_at: null,
    completed_by: "",
    completion_notes: "",
    completed_at: null,
  },
  {
    id: "2",
    title: "Adult Grubmaster – May Campout at Eisenhower SP",
    type: "Role",
    ask: "Weekend camping",
    recipient: "Scoutmaster / ASMs",
    commitment_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    execution_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contributor_profile: "Committee Member / Parent",
    notes: "Coordinate menu with SPL. Grocery shopping Friday before campout.",
    assigned_to: "Mike Henderson",
    claim_notes: "Happy to do this one. Will coordinate with SPL next week.",
    status: "Claimed",
    created_at: new Date().toISOString(),
    claimed_at: new Date().toISOString(),
    completed_by: "",
    completion_notes: "",
    completed_at: null,
  },
  {
    id: "3",
    title: "Drive to Lost Pines trailhead (need 2 drivers)",
    type: "Service",
    ask: "3+ hours",
    recipient: "Scoutmaster / ASMs",
    commitment_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    execution_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contributor_profile: "Committee Member / Parent",
    notes: "Depart 6:00 AM from church lot. Return by 5 PM. YPT required.",
    assigned_to: "",
    claim_notes: "",
    status: "Open",
    created_at: new Date().toISOString(),
    claimed_at: null,
    completed_by: "",
    completion_notes: "",
    completed_at: null,
  },
  {
    id: "4",
    title: "Coordinate Emergency Preparedness Merit Badge counselor",
    type: "Task",
    ask: "1–3 hours",
    recipient: "Committee Chair",
    commitment_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    execution_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contributor_profile: "Role-specific (see Notes)",
    notes: "Need someone with EMT/Fire/Medical background. Contact district MB coordinator.",
    assigned_to: "",
    claim_notes: "",
    status: "Open",
    created_at: new Date().toISOString(),
    claimed_at: null,
    completed_by: "",
    completion_notes: "",
    completed_at: null,
  },
  {
    id: "5",
    title: "Popcorn inventory count and warehouse pickup",
    type: "Service",
    ask: "3+ hours",
    recipient: "Popcorn Colonel",
    commitment_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    execution_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contributor_profile: "Committee Member / Parent",
    notes: "Pickup at Trail's End warehouse in Irving. Truck/SUV required.",
    assigned_to: "",
    claim_notes: "",
    status: "Open",
    created_at: new Date().toISOString(),
    claimed_at: null,
    completed_by: "",
    completion_notes: "",
    completed_at: null,
  },
  {
    id: "6",
    title: "Summer Camp medical form collection",
    type: "Task",
    ask: "< 1 hour",
    recipient: "Summer Camp Coordinator",
    commitment_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    execution_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contributor_profile: "Committee Member / Parent",
    notes: "Follow up with families who haven't submitted Part A/B/C forms.",
    assigned_to: "Sarah Chen",
    claim_notes: "I'll send reminder emails this week.",
    status: "Complete",
    created_at: new Date().toISOString(),
    claimed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completed_by: "Sarah Chen",
    completion_notes: "All forms collected and filed.",
    completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
