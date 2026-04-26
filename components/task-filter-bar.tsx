"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import type { TaskType, TaskAsk, TaskRecipient, ContributorProfile, TaskStatus } from "@/lib/supabase"

export type Filters = {
  type: TaskType | "all"
  ask: TaskAsk | "all"
  recipient: TaskRecipient | "all"
  contributorProfile: ContributorProfile | "all"
  status: TaskStatus | "all"
  urgentOnly: boolean
}

interface TaskFilterBarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const typeOptions: (TaskType | "all")[] = ["all", "Task", "Service", "Role"]
const askOptions: (TaskAsk | "all")[] = ["all", "< 1 hour", "1–3 hours", "3+ hours", "Weekend camping"]
const recipientOptions: (TaskRecipient | "all")[] = [
  "all",
  "Scoutmaster / ASMs",
  "Committee Chair",
  "Treasurer",
  "Summer Camp Coordinator",
  "Popcorn Colonel",
  "Other (see Notes)",
]
const profileOptions: (ContributorProfile | "all")[] = [
  "all",
  "Committee Member / Parent",
  "ASM",
  "Youth",
  "Role-specific (see Notes)",
]
const statusOptions: (TaskStatus | "all")[] = ["all", "Open", "Claimed", "Complete"]

export function TaskFilterBar({ filters, onFiltersChange }: TaskFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.ask !== "all" ||
    filters.recipient !== "all" ||
    filters.contributorProfile !== "all" ||
    filters.status !== "all" ||
    filters.urgentOnly

  const filterCount = [
    filters.type !== "all",
    filters.ask !== "all",
    filters.recipient !== "all",
    filters.contributorProfile !== "all",
    filters.status !== "all",
    filters.urgentOnly,
  ].filter(Boolean).length

  return (
    <div className="space-y-3">
      {/* Mobile: Expandable filter button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full justify-between ${hasActiveFilters ? "border-[#BF0000] text-[#BF0000]" : ""}`}
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters {filterCount > 0 && `(${filterCount})`}
          </span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {isExpanded && (
          <div className="mt-3 space-y-3 p-4 bg-muted/30 rounded-lg border">
            <FilterSelect
              label="Type"
              value={filters.type}
              options={typeOptions}
              onChange={(v) => updateFilter("type", v as TaskType | "all")}
            />
            <FilterSelect
              label="Ask"
              value={filters.ask}
              options={askOptions}
              onChange={(v) => updateFilter("ask", v as TaskAsk | "all")}
            />
            <FilterSelect
              label="Recipient"
              value={filters.recipient}
              options={recipientOptions}
              onChange={(v) => updateFilter("recipient", v as TaskRecipient | "all")}
            />
            <FilterSelect
              label="Profile"
              value={filters.contributorProfile}
              options={profileOptions}
              onChange={(v) => updateFilter("contributorProfile", v as ContributorProfile | "all")}
            />
            <FilterSelect
              label="Status"
              value={filters.status}
              options={statusOptions}
              onChange={(v) => updateFilter("status", v as TaskStatus | "all")}
            />
            <div className="flex items-center gap-3 pt-2">
              <Switch
                id="urgent-mobile"
                checked={filters.urgentOnly}
                onCheckedChange={(checked) => updateFilter("urgentOnly", checked)}
              />
              <Label htmlFor="urgent-mobile" className="text-sm font-medium cursor-pointer">
                Urgent only
              </Label>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() =>
                  onFiltersChange({
                    type: "all",
                    ask: "all",
                    recipient: "all",
                    contributorProfile: "all",
                    status: "all",
                    urgentOnly: false,
                  })
                }
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Desktop: Horizontal filter bar */}
      <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-3">
        <FilterSelect
          label="Type"
          value={filters.type}
          options={typeOptions}
          onChange={(v) => updateFilter("type", v as TaskType | "all")}
          compact
        />
        <FilterSelect
          label="Ask"
          value={filters.ask}
          options={askOptions}
          onChange={(v) => updateFilter("ask", v as TaskAsk | "all")}
          compact
        />
        <FilterSelect
          label="Recipient"
          value={filters.recipient}
          options={recipientOptions}
          onChange={(v) => updateFilter("recipient", v as TaskRecipient | "all")}
          compact
        />
        <FilterSelect
          label="Profile"
          value={filters.contributorProfile}
          options={profileOptions}
          onChange={(v) => updateFilter("contributorProfile", v as ContributorProfile | "all")}
          compact
        />
        <FilterSelect
          label="Status"
          value={filters.status}
          options={statusOptions}
          onChange={(v) => updateFilter("status", v as TaskStatus | "all")}
          compact
        />
        <div className="flex items-center gap-2 px-2">
          <Switch
            id="urgent-desktop"
            checked={filters.urgentOnly}
            onCheckedChange={(checked) => updateFilter("urgentOnly", checked)}
          />
          <Label htmlFor="urgent-desktop" className="text-sm font-medium cursor-pointer whitespace-nowrap">
            Urgent only
          </Label>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onFiltersChange({
                type: "all",
                ask: "all",
                recipient: "all",
                contributorProfile: "all",
                status: "all",
                urgentOnly: false,
              })
            }
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

interface FilterSelectProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  compact?: boolean
}

function FilterSelect({ label, value, options, onChange, compact }: FilterSelectProps) {
  return (
    <div className={compact ? "flex items-center gap-2" : "space-y-1.5"}>
      {!compact && <Label className="text-xs text-muted-foreground">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={compact ? "w-auto min-w-[100px]" : "w-full"}>
          <SelectValue>
            {compact && value === "all" ? label : value === "all" ? `All ${label}s` : value}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option === "all" ? `All ${label}s` : option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
