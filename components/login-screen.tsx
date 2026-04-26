"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const CORRECT_PASSWORD = "troop221"

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem("t221_auth", "true")
      onLogin()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <Card 
        className={cn(
          "w-full max-w-sm transition-transform",
          shake && "animate-shake"
        )}
      >
        <CardHeader className="text-center space-y-1 pb-4">
          <h1 className="text-3xl font-bold text-[#BF0000]">TROOP 221</h1>
          <p className="text-sm text-muted-foreground">Character | Adventure | Leadership</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                className={cn(
                  error && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {error && (
                <p className="text-sm text-destructive">
                  Incorrect password. Please try again.
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#BF0000] hover:bg-[#A00000] text-white"
            >
              Enter
            </Button>
          </form>
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        TROOP 221 · Plano, Texas · t221.org
      </footer>
    </div>
  )
}
