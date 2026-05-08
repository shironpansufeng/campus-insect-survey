"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function submitRecord(formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const insect_name = String(formData.get("insect_name") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const habitat = String(formData.get("habitat") || "").trim();
  const observed_at = String(formData.get("observed_at") || "").trim();
  const note = String(formData.get("note") || "").trim();
  const count = Number(formData.get("count") || 0);
  const image = formData.get("image") as File | null;

  if (!insect_name || !location || !habitat || !observed_at || !count || !image?.size) {
    return { error: "请填写完整信息，并上传一张图片。" };
  }

  const fileExt = image.name.split(".").pop() || "jpg";
  const filePath = `${user.id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("record-images")
    .upload(filePath, image, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: "图片上传失败，请稍后重试。" };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("record-images").getPublicUrl(filePath);

  const { error: insertError } = await supabase.from("insect_records").insert({
    user_id: user.id,
    insect_name,
    location,
    habitat,
    count,
    observed_at,
    note: note || null,
    image_url: publicUrl,
    status: "pending",
  });

  if (insertError) {
    return { error: "记录保存失败，请稍后再试。" };
  }

  revalidatePath("/submit");
  revalidatePath("/review");

  return { success: "上传成功，记录已进入待审核状态。" };
}
