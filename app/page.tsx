"use client"

import { useState, useEffect } from "react"
import { LoginScreen } from "@/components/login-screen"
import { MainApp } from "@/components/main-app"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authState = localStorage.getItem("t221_auth")
    setIsAuthenticated(authState === "true")
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#BF0000]">TROOP 221</h1>
          <p className="text-sm text-muted-foreground mt-1">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />
  }

  return <MainApp onLogout={() => setIsAuthenticated(false)} />
}
