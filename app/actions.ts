"use server"

import { supabase } from "@/lib/supabase"

export interface SubmissionData {
  candidate_name: string
  contact_info: string
  selected_date: string
  selected_time: string
  selected_restaurant: string
  selected_food: string
  selected_archetype: string
}

export async function submitProposal(data: SubmissionData) {
  // Server-side validation of empty fields
  if (
    !data.candidate_name.trim() ||
    !data.contact_info.trim() ||
    !data.selected_date ||
    !data.selected_time ||
    !data.selected_restaurant ||
    !data.selected_food ||
    !data.selected_archetype
  ) {
    return { success: false, error: "Please complete all fields and selections before submitting! 🥺" }
  }

  try {
    const { error } = await supabase
      .from("proposal_submissions")
      .insert([
        {
          candidate_name: data.candidate_name,
          contact_info: data.contact_info,
          selected_date: data.selected_date,
          selected_time: data.selected_time,
          selected_restaurant: data.selected_restaurant,
          selected_food: data.selected_food,
          selected_archetype: data.selected_archetype,
        },
      ])

    if (error) {
      console.error("Supabase Database Error:", error)
      return { success: false, error: error.message }
    }

    // Optional Telegram notification dispatch
    const tgToken = process.env.TELEGRAM_BOT_TOKEN
    const tgChatId = process.env.TELEGRAM_CHAT_ID

    if (tgToken && tgChatId) {
      try {
        const text = `💖 *New Date Proposal Locked In!* 💖\n\n👤 *Candidate:* ${data.candidate_name}\n🗓️ *Date:* ${data.selected_date}\n⏰ *Time:* ${data.selected_time}\n📍 *Spot:* ${data.selected_restaurant}\n🍕 *Food:* ${data.selected_food}\n✨ *Archetype:* ${data.selected_archetype}\n📱 *Contact:* ${data.contact_info}\n\n_Sent from Uchrashuv App_ ✨`
        
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: text,
            parse_mode: "Markdown",
          }),
        })
      } catch (tgErr) {
        console.error("Failed to dispatch Telegram notification:", tgErr)
      }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Server Action Exception:", err)
    return { success: false, error: err?.message || "Something went wrong. Please try again! 😭" }
  }
}

export async function logAnalyticsEvent(eventType: "view" | "start_flow" | "submit", sessionId: string) {
  if (!sessionId) return { success: false, error: "Invalid session ID" }

  try {
    const { error } = await supabase
      .from("analytics_events")
      .insert([
        {
          event_type: eventType,
          session_id: sessionId,
        },
      ])

    if (error) {
      // PostgREST unique violation code is 23505.
      if (error.code === "23505") {
        return { success: true }
      }
      console.error("Supabase Analytics insertion failed:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Server Action Analytics Exception:", err)
    return { success: false, error: err?.message || "Internal error logging event" }
  }
}

export interface AnalyticsStats {
  totalViews: number
  totalStarts: number
  totalSubmits: number
  conversionRate: number
  dailyStats: {
    date: string
    views: number
    starts: number
    submits: number
  }[]
}

export async function getAnalyticsStats() {
  try {
    const { data, error } = await supabase
      .from("analytics_events")
      .select("event_type, created_at")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Supabase query failed for stats:", error)
      return { success: false, error: error.message }
    }

    let totalViews = 0
    let totalStarts = 0
    let totalSubmits = 0
    const dailyMap: Record<string, { views: number; starts: number; submits: number }> = {}

    data?.forEach((row) => {
      const type = row.event_type
      if (type === "view") totalViews++
      else if (type === "start_flow") totalStarts++
      else if (type === "submit") totalSubmits++

      const dateStr = new Date(row.created_at).toISOString().split("T")[0]
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = { views: 0, starts: 0, submits: 0 }
      }

      if (type === "view") dailyMap[dateStr].views++
      else if (type === "start_flow") dailyMap[dateStr].starts++
      else if (type === "submit") dailyMap[dateStr].submits++
    })

    const conversionRate = totalStarts > 0 ? (totalSubmits / totalStarts) * 100 : 0

    const dailyStats = Object.entries(dailyMap).map(([date, counts]) => ({
      date,
      ...counts,
    }))

    return {
      success: true,
      stats: {
        totalViews,
        totalStarts,
        totalSubmits,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        dailyStats,
      } as AnalyticsStats,
    }
  } catch (err: any) {
    console.error("Server Action getAnalyticsStats Exception:", err)
    return { success: false, error: err?.message || "Internal error compiling statistics" }
  }
}

