"use client"

/**
 * Returns a persistent session ID for the current browser session.
 * Utilizes sessionStorage so it persists across page refreshes,
 * but starts fresh when the tab/window is closed and reopened.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let sessionId = sessionStorage.getItem("date-sparks-session-id")
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now().toString(36)
    sessionStorage.setItem("date-sparks-session-id", sessionId)
  }
  return sessionId
}
