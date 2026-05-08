"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    });
  };

  return (
    <button type="button" className="button button--secondary" onClick={handleSignOut}>
      {isPending ? "退出中..." : "退出登录"}
    </button>
  );
}
