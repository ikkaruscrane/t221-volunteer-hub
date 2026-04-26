"use client"

import { useState } from "react"
import { TaskList } from "@/components/task-list"
import { LogRequestForm } from "@/components/log-request-form"
import { TroopLogo } from "@/components/troop-logo"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "tasks" | "log"

interface MainAppProps {
  onLogout: () => void
}

export function MainApp({ onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>("tasks")

  const handleLogout = () => {
    localStorage.removeItem("t221_auth")
    onLogout()
  }

  const handleLogSuccess = () => {
    setActiveTab("tasks")
  }

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
          <TaskList />
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
    </div>
  )
}
