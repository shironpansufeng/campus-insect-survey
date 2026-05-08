import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { InsectRecord } from "@/types";

export async function getApprovedRecords() {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insect_records")
    .select(
      "id, user_id, insect_name, location, habitat, count, observed_at, note, image_url, status, reviewed_by, reviewed_at, created_at, updated_at",
    )
    .eq("status", "approved")
    .order("observed_at", { ascending: false });

  if (error) {
    throw new Error("读取已审核记录失败。");
  }

  return (data ?? []) as InsectRecord[];
}

export async function getPendingRecords() {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insect_records")
    .select(
      `
        id,
        user_id,
        insect_name,
        location,
        habitat,
        count,
        observed_at,
        note,
        image_url,
        status,
        reviewed_by,
        reviewed_at,
        created_at,
        updated_at,
        uploader:profiles!insect_records_user_id_fkey(name)
      `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("读取待审核记录失败。");
  }

  return (data ?? []).map((record) => ({
    ...record,
    uploader: Array.isArray(record.uploader) ? record.uploader[0] ?? null : null,
  })) as InsectRecord[];
}
