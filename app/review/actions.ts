"use server";

import { revalidatePath } from "next/cache";
import { requireTeacher } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { RecordStatus } from "@/types";

export async function reviewRecord(recordId: string, nextStatus: Extract<RecordStatus, "approved" | "rejected">) {
  const teacher = await requireTeacher();
  const supabase = await createClient();

  const { error } = await supabase
    .from("insect_records")
    .update({
      status: nextStatus,
      reviewed_by: teacher.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", recordId);

  if (error) {
    return { error: "审核操作失败，请稍后再试。" };
  }

  revalidatePath("/review");
  revalidatePath("/records");

  return { success: "记录状态已更新。" };
}
