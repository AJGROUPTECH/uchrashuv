"use server"

import { supabase } from "@/lib/supabase"

export interface SubmissionData {
  candidate_name?: string
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
          candidate_name: data.candidate_name || data.contact_info || "",
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
        const text = `💌 *NEW DATE REQUEST*\n\n📅 *Date:* ${data.selected_date}\n⏰ *Time:* ${data.selected_time}\n📍 *Spot:* ${data.selected_restaurant}\n🍽 *Food:* ${data.selected_food}\n✨ *Archetype:* ${data.selected_archetype}\n👤 *Username:* ${data.contact_info}\n\n_Sent from Uchrashuv App_ ✨`
        
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

export async function logAnalyticsEvent(
  eventType:
    | "view"
    | "start_flow"
    | "submit"
    | "landing_view"
    | "clicked_yes"
    | "selected_date"
    | "selected_time"
    | "selected_restaurant"
    | "selected_food"
    | "selected_vibe"
    | "reached_contact_step"
    | "submitted_proposal",
  sessionId: string
) {
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

export async function createInvitation() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  try {
    const { error } = await supabase
      .from("invitations")
      .insert([{ invitation_code: code }])

    if (error) {
      console.error("Supabase error creating invitation:", error)
      return { success: false, error: error.message }
    }

    // Admin Telegram Notification (Analytics only)
    const tgToken = process.env.TELEGRAM_BOT_TOKEN
    const tgChatId = process.env.TELEGRAM_CHAT_ID
    if (tgToken && tgChatId) {
      try {
        const text = `🎉 *New invitation created*\n\n🔑 *Code:* \`${code}\`\n\n_Sent from Uchrashuv App_ ✨`
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
        console.error("Failed to send Telegram notification:", tgErr)
      }
    }

    return { success: true, code }
  } catch (err: any) {
    console.error("createInvitation exception:", err)
    return { success: false, error: err?.message || "Failed to create invitation." }
  }
}

export interface InvitationResponseData {
  invitation_code: string
  selected_date: string
  selected_time: string
  selected_restaurant: string
  selected_food: string
  selected_archetype: string
  contact_username: string
}

export async function submitInvitationResponse(data: InvitationResponseData) {
  if (
    !data.invitation_code ||
    !data.selected_date ||
    !data.selected_time ||
    !data.selected_restaurant ||
    !data.selected_food ||
    !data.selected_archetype ||
    !data.contact_username.trim()
  ) {
    return { success: false, error: "Please complete all selections and enter your username! 🥺" }
  }

  try {
    const { error } = await supabase
      .from("invitation_responses")
      .insert([
        {
          invitation_code: data.invitation_code,
          selected_date: data.selected_date,
          selected_time: data.selected_time,
          selected_restaurant: data.selected_restaurant,
          selected_food: data.selected_food,
          selected_archetype: data.selected_archetype,
          contact_username: data.contact_username,
        },
      ])

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "This invitation has already been accepted! 🥺" }
      }
      console.error("Supabase error submitting invitation response:", error)
      return { success: false, error: error.message }
    }

    // Fetch stats for Admin Telegram Bot notification
    const tgToken = process.env.TELEGRAM_BOT_TOKEN
    const tgChatId = process.env.TELEGRAM_CHAT_ID

    if (tgToken && tgChatId) {
      try {
        const todayStr = new Date().toISOString().split("T")[0]

        // Get completed count today
        const { count: submitsToday } = await supabase
          .from("invitation_responses")
          .select("*", { count: "exact", head: true })
          .gte("created_at", `${todayStr}T00:00:00Z`)

        // Get created count today
        const { count: invitesToday } = await supabase
          .from("invitations")
          .select("*", { count: "exact", head: true })
          .gte("created_at", `${todayStr}T00:00:00Z`)

        let totalSubmits = submitsToday || 0
        let totalInvites = invitesToday || 1
        if (totalInvites < totalSubmits) totalInvites = totalSubmits

        const rate = ((totalSubmits / totalInvites) * 100).toFixed(1)

        const text = `📨 *New invitation completed*\n\n📊 *Total submissions today:* ${totalSubmits}\n📈 *Conversion rate:* ${rate}%\n\n_Sent from Uchrashuv App_ ✨`
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
        console.error("Failed to compile stats / notify Telegram:", tgErr)
      }
    }

    return { success: true }
  } catch (err: any) {
    console.error("submitInvitationResponse exception:", err)
    return { success: false, error: err?.message || "Failed to submit response." }
  }
}

export async function getInvitationResponse(code: string) {
  if (!code) return { success: false, error: "Missing invitation code" }

  try {
    const { data: responseData, error: responseError } = await supabase
      .from("invitation_responses")
      .select("*")
      .eq("invitation_code", code)
      .maybeSingle()

    if (responseError) {
      console.error("Supabase error checking invitation response:", responseError)
      return { success: false, error: responseError.message }
    }

    if (responseData) {
      return { success: true, exists: true, data: responseData }
    }

    const { data: inviteData, error: inviteError } = await supabase
      .from("invitations")
      .select("*")
      .eq("invitation_code", code)
      .maybeSingle()

    if (inviteError) {
      console.error("Supabase error checking invitation code:", inviteError)
      return { success: false, error: inviteError.message }
    }

    if (inviteData) {
      return { success: true, exists: false, message: "pending" }
    } else {
      return { success: false, error: "Invalid invitation code." }
    }
  } catch (err: any) {
    console.error("getInvitationResponse exception:", err)
    return { success: false, error: err?.message || "Failed to check invitation status." }
  }
}

