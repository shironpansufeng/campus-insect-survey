import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export const getSessionUser = cache(async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, name, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return data as Profile | null;
});

export async function requireUser() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireTeacher() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "teacher") {
    redirect("/");
  }

  return profile;
}
