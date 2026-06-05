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

    return { success: true }
  } catch (err: any) {
    console.error("Server Action Exception:", err)
    return { success: false, error: err?.message || "Something went wrong. Please try again! 😭" }
  }
}
