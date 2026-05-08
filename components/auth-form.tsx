"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage("");
    setSuccessMessage("");

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const name = String(formData.get("name") || "");

    startTransition(async () => {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        setSuccessMessage("注册成功，请使用新账号登录。");
        router.push("/login");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.refresh();
      router.push("/submit");
    });
  };

  return (
    <div className="auth-wrap">
      <section className="auth-card">
        <h1>{mode === "login" ? "登录" : "注册"}</h1>
        <p className="hint">
          {mode === "login"
            ? "登录后可以上传记录，老师账号还可以审核待处理记录。"
            : "MVP 阶段新注册用户默认都是学生角色。"}
        </p>

        <form action={handleSubmit} className="field-list">
          {mode === "register" ? (
            <div className="field">
              <label htmlFor="name">姓名或昵称</label>
              <input id="name" name="name" required />
            </div>
          ) : null}

          <div className="field">
            <label htmlFor="email">邮箱</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div className="field">
            <label htmlFor="password">密码</label>
            <input id="password" name="password" type="password" required minLength={6} />
          </div>

          {errorMessage ? <p className="form-message">{errorMessage}</p> : null}
          {successMessage ? <p className="form-message">{successMessage}</p> : null}

          <button type="submit" disabled={isPending}>
            {isPending
              ? "提交中..."
              : mode === "login"
                ? "登录"
                : "注册"}
          </button>
        </form>

        <p className="hint">
          {mode === "login" ? "还没有账号？" : "已经有账号了？"}{" "}
          <Link href={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "去注册" : "去登录"}
          </Link>
        </p>
      </section>
    </div>
  );
}
